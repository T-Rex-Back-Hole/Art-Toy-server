import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerClient = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    console.log("Register attempt:", { userName, email });

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // ตรวจสอบว่ามีอีเมลซ้ำหรือไม่
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      role: "user"
    });

<<<<<<< HEAD
    await newUser.save();
    console.log("User created successfully:", newUser._id);
=======
    // บ���ึกผู้ใช้ใหม่
    await newClient.save();
>>>>>>> 89b9449632d12a197ecd01d7db213d99e66d6d34

    // ส่ง response กลับ
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
};

export const loginClient = async (req, res) => {
<<<<<<< HEAD
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    // ตรวจสอบว่ามีการส่ง email และ password มาหรือไม่
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password"
      });
    }

    // ค้นหาผู้ใช้จากอีเมล
    const user = await User.findOne({ email });
    console.log("Found user:", user ? "Yes" : "No");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    // เปรียบเทียบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password"
      });
    }

    // สร้าง token
=======
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

>>>>>>> 89b9449632d12a197ecd01d7db213d99e66d6d34
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        userName: user.userName 
      },
      process.env.CLIENT_SECRET_KEY,
      { expiresIn: "1d" }
    );

<<<<<<< HEAD
    // ส่งข้อมูลกลับ
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email
      }
=======
    res.status(200).json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      client: {
        id: client._id,
        userName: client.userName,
        email: client.email,
      },
>>>>>>> 89b9449632d12a197ecd01d7db213d99e66d6d34
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
<<<<<<< HEAD
      message: "An error occurred during login"
=======
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
>>>>>>> 89b9449632d12a197ecd01d7db213d99e66d6d34
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

<<<<<<< HEAD
export const getClientProfile = async (req, res) => {
  try {
    const userID = req.client.id;
    console.log('UserID:', userID);
    
    // ดึงข้อมูลผู้ใช้โดยไม่รวมรหัสผ่าน
    const user = await User.findById(userID).select('-password');
    console.log('User found:', user);

=======
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.client.id;

    // ตรวจสอบว่ามี user หรือไม่
    const user = await User.findById(userId);
>>>>>>> 89b9449632d12a197ecd01d7db213d99e66d6d34
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

<<<<<<< HEAD
    // ส่งข้อมูลผู้ใช้กลับไป
    res.json({
      success: true,
      userData: {
        userName: user.userName,
        email: user.email,
      }
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: error.message
=======
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
>>>>>>> 89b9449632d12a197ecd01d7db213d99e66d6d34
    });
  }
};

