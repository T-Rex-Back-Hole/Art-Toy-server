import Client from '../models/client.js';
import jwt from 'jsonwebtoken';

// ฟังก์ชันสำหรับสร้าง JWT token โดยรับ id ของ client
const signToken = (id) => {
  return jwt.sign(
    { id }, // payload ที่จะเก็บใน token
    process.env.JWT_SECRET, // secret key จาก environment variable
    { expiresIn: process.env.JWT_EXPIRES_IN } // ระยะเวลาหมดอายุของ token
  );
};

// Controller สำหรับการลงทะเบียน client ใหม่
export const register = async (req, res) => {
  try {
    // สร้าง client ใหม่จากข้อมูลที่ส่งมาใน request body
    const newClient = await Client.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password // รหัสผ่านจะถูกเข้ารหัสอัตโนมัติโดย middleware
    });

    // สร้าง token สำหรับ client ใหม่
    const token = signToken(newClient._id);

    // ส่งข้อมูลตอบกลับพร้อม token
    res.status(201).json({
      status: 'success',
      token,
      data: {
        client: newClient
      }
    });
  } catch (err) {
    // จัดการกรณีเกิดข้อผิดพลาด เช่น อีเมลซ้ำ หรือข้อมูลไม่ครบ
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Controller สำหรับการเข้าสู่ระบบ
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

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

    // 3) ตรวจสอบว่ามี client อยู่ในระบบ และรหัสผ่านถูกต้อง
    if (!client || !(await client.correctPassword(password, client.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
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
    .json({ success: true, message: "Logout successful." });
};