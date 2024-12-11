import jwt from "jsonwebtoken";
import Client from '../models/User.js';

const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

const checkAuth = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found"
      });
    }

    const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);
    
    return res.status(200).json({
      success: true,
      user: decoded
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid or expired"
    });
  }
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user!"
      });
    }


    // สร้าง JWT token
    const token = jwt.sign(
      {
        id: checkClient._id,
        email: checkClient.email,
      },
      process.env.CLIENT_SECRET_KEY,
      { expiresIn: "60m" } // token หมดอายุใน 60 นาที
    );

    // ส่ง token กลับในรูปแบบ cookie และข้อมูล response
    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      client: {
        email: checkClient.email,
        id: checkClient._id,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// Controller สำหรับการออกจากระบบ
const logoutClient = (req, res) => {
  // ลบ token cookie และส่งข้อความยืนยัน
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

// Middleware สำหรับตรวจสอบการยืนยันตัวตน
const authMiddleware = async (req, res, next) => {
  // ดึง token จาก cookie
  const token = req.headers.authorization.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
    // console.log("Log Token => ", token)

  try {
    // ตรวจสอบความถูกต้องของ token
    const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);
    req.client = decoded;
    next();
    
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({
      success: false,
      message: "Unauthorized user!"
    });
  }
};

export { checkAuth, authMiddleware };
