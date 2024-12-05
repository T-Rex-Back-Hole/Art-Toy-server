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


    // ส่งข้อมูลตอบกลับพร้อม token
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
  }
};


export const loginClient = async (req, res) => {
  const { email, password, } = req.body;
  try {
    // Find the user by email
    const client = await User.findOne({ email });
    if (!client) {
      return res
        .status(400)
        .json({ success: false, message: "Email not found." });
    }


    // 1) ตรวจสอบว่ามีการส่งอีเมลและรหัสผ่านมาหรือไม่
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'กรุณากรอกอีเมลและรหัสผ่าน'
      });
    }

    // 2) ค้นหา client จากอีเมล และดึงฟิลด์ password มาด้วย
    // (ปกติฟิลด์ password จะถูกซ่อนไว้ ต้องใช้ select('+password'))
    const client = await Client.findOne({ email }).select('+password');

    res
      .cookie("token", token, { httpOnly: true, secure: false }) // `secure: true` for HTTPS production
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
    }

    // 4) ถ้าทุกอย่างถูกต้อง สร้าง token และส่งกลับ
    const token = signToken(client._id);
    res.status(200).json({
      status: 'success',
      token
    });
  } catch (err) {
    // จัดการข้อผิดพลาดที่อาจเกิดขึ้น
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Controller สำหรับการออกจากระบบ
export const logoutClient = (req, res) => {
  // ลบ cookie token และส่งข้อความยืนยัน
  res
    .clearCookie("token")
    .status(200)

    .json({ success: true, message: "Logout successful.😎 😎 😎" });
};
