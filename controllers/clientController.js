import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerClient = async (req, res) => {
  const { userName, email, password, role } = req.body;

  if (!userName) {
    return res.status(400).json({
      success: false,
      message: "userName is required.",
    });
  }

  const assignedRole = role && ["admin", "user"].includes(role) ? role : "user";

  try {
    // ตรวจสอบว่ามีผู้ใช้ที่มีอีเมลเดียวกันหรือไม่
    const existingClient = await User.findOne({ email });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "Client already exists with this email.",
      });
    }

    // แฮชรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่
    const newClient = new User({
      userName,
      email,
      role: assignedRole,
      password: hashedPassword,
    });

    // บันทึกผู้ใช้ใหม่
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
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "Registration failed." });
  }
};

export const loginClient = async (req, res) => {
  const { email, password } = req.body;

  try {
    // ตรวจสอบว่ามีผู้ใช้ในฐานข้อมูลหรือไม่
    const client = await User.findOne({ email });
    if (!client) {
      return res
        .status(400)
        .json({ success: false, message: "Email not found." });
    }

    // ตรวจสอบว่า client.password มีค่าหรือไม่
    if (!client.password) {
      return res.status(400).json({
        success: false,
        message: "Password is missing in the database.",
      });
    }

    // ตรวจสอบว่า password ที่ได้รับจากผู้ใช้ไม่เป็น null หรือ undefined
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required." });
    }

    // เปรียบเทียบรหัสผ่านที่ผู้ใช้กรอกกับรหัสผ่านที่แฮชแล้ว
    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });
    }

    // สร้าง JWT token
    const token = jwt.sign(
      { id: client._id, email: client.email },
      process.env.CLIENT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // ส่งคุกกี้และข้อมูลของผู้ใช้
    res
      .cookie("token", token, { httpOnly: true, secure: false }) // `secure: true` สำหรับ HTTPS ในโปรดักชัน
      .status(200)
      .json({
        success: true,
        message: "Login successful.👌👌",
        client: {
          id: client._id,
          userName: client.userName,
          email: client.email,
        },
      });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Login failed." });
  }
};

export const logoutClient = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ success: true, message: "Logout successful.😎 😎 😎" });
};
