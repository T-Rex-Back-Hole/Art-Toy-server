import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerClient = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName) {
    return res.status(400).json({
      success: false,
      message: "Username is required.",
    });
  }

  const assignedRole = "user";
  try {
    const existingClient = await User.findOne({ email });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "Client already exists with this email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newClient = new User({
      userName,
      email,
      role: assignedRole,
      password: hashedPassword,
    });

    await newClient.save();

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully." });
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during registration." });
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
    // ค้นหาผู้ใช้จากอีเมล
    const client = await User.findOne({ email });
    if (!client) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials", // "ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง"
      });
    }

    // เปรียบเทียบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials", // "ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง"
      });
    }

    // สร้าง JWT Token
    const token = jwt.sign(
      { id: client._id, email: client.email },
      process.env.CLIENT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // ส่ง Token กลับไป
    res.status(200).json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ", // "Login successful"
      token, // ส่ง Token กลับไป
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
      message: "Login failed", // "การเข้าสู่ระบบล้มเหลว"
    });
  }
};

export const logoutClient = (req, res) => {
  // Just send a response indicating successful logout.
  res
    .status(200)
    .json({ success: true, message: "Logout successful.😎 😎 😎" });
};
