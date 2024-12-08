import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerClient = async (req, res) => {
  const { userName, email, password, role } = req.body;
  const assignedRole = role && ["admin", "user"].includes(role) ? role : "user";

  try {
    // Check if the client already exists
    const existingClient = await User.findOne({ email });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "Client already exists with this email.",
      });
    }
    console.log(password);
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new client
    const newClient = new User({
      userName,
      email,
      role: assignedRole,
      password: hashedPassword,
    });

    // Save the client to the database
    await newClient.save();

    res.status(201).json({
      success: true,
      message: "Client registered successfully.",
      client: {
        id: newClient._id,
        userName: newClient.userName,
        email: newClient.email,
        role: newClient.role,
      },
    });

    await newUser.save();

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

  // ตรวจสอบว่า email และ password ถูกส่งเข้ามาหรือไม่
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
        message: "ไม่พบอีเมลนี้ในระบบ",
      });
    }

    // ตรวจสอบว่ารหัสผ่านถูกส่งมา
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกรหัสผ่าน",
      });
    }

    // ตรวจสอบว่า client.password มีค่า
    if (!client.password) {
      return res.status(500).json({
        success: false,
        message: "รหัสผ่านไม่ถูกต้องในฐานข้อมูล",
      });
    }

    // เปรียบเทียบรหัสผ่านที่กรอกกับรหัสผ่านที่เก็บในฐานข้อมูล
    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง",
      });
    }

    // สร้าง JWT Token
    const token = jwt.sign(
      { id: client._id, email: client.email },
      process.env.CLIENT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // ส่งคุกกี้ที่เก็บ token กลับไป
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({
        success: true,
        message: "เข้าสู่ระบบสำเร็จ",
        client: {
          id: client._id,
          userName: client.userName,
          email: client.email,
        },
      });
  } catch (error) {
    console.error("ข้อผิดพลาดในการเข้าสู่ระบบ:", error);
    res.status(500).json({ success: false, message: "การเข้าสู่ระบบล้มเหลว" });
  }
};

export const logoutClient = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ success: true, message: "Logout successful.😎 😎 😎" });
};
