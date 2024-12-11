import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const registerClient = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName) {
    return res.status(400).json({
      success: false,
      message: "Username is required.",
    });
  }

  // const assignedRole = role && ["admin", "user"].includes(role) ? role : "user";
  const assignedRole = "user";
  try {
    // ตรวจสอบว่ามีผู้ใช้ที่มีอีเมลเดียวกันหรือไม่
    const existingClient = await User.findOne({ email });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "Client already exists with this email.",
      });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่
    const newClient = new User({
      userName,
      email,
      role: assignedRole,
      password: hashedPassword,
    });

    // บ���ึกผู้ใช้ใหม่
    await newClient.save();

    // ส่ง response เพียงครั้งเดียว
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      client: {
        id: newClient._id,
        userName: newClient.userName,
        email: newClient.email,
        role: newClient.role,
      },
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration."
    });
  }
};

export const loginClient = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "กรุณากรอกอีเมลและรหัสผ่าน",
    });
  }

  try {
    const client = await User.findOne({ email });
    if (!client) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: client._id, email: client.email },
      process.env.CLIENT_SECRET_KEY,
      { expiresIn: "1y" }
    );

    res.status(200).json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      client: {
        id: client._id,
        userName: client.userName,
        email: client.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

export const getClientProfile = async (req, res) => {
  try {
    const userID = req.client.id;

    const user = await User.findById(userID).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      userData: {
        userName: user.userName,
        email: user.email,
      }
    });
  } catch (error) {
    console.log("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user profile"
    });
  }
};

export const logoutClient = (req, res) => {
  try{
    res.clearCookie("token");
    return res.status(200).json({ 
      success: true, 
    message: "Logout successful.😎 �� 😎"
   });
  } catch (error) {
    console.error("Logout error", error);
    return res.status(500).json({
      success: false,
      message: "Error logging out"
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.client.id;

    // ตรวจสอบว่ามี user หรือไม่
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // ตรวจสอบรหัสผ่านปัจจุบัน
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // เข้ารหัสและบันทึกรหัสผ่านใหม่
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Error changing password"
    });
  }
};

