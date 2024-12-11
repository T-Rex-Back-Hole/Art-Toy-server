import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};
const checkAuth = async (req, res) => {
  try{
    const token = req.header.authurization.replace("barer")

  }catch{

  }
}
// Controller สำหรับการลงทะเบียน client ใหม่
const registerClient = async (req, res) => {
  // รับข้อมูลจาก request body
  const { name, email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  try {
    // ตรวจสอบว่ามีอีเมลนี้ในระบบแล้วหรือไม่
    const checkClient = await Client.findOne({ email });
    if (checkClient)
      return res.json({
        success: false,
        message: "Client Already exists with the same email! Please try again",
      });

    // เข้ารหัสรหัสผ่านด้วย bcrypt ที่ความซับซ้อน 12
    const hashPassword = await bcrypt.hash(password, 12);
    
    // สร้าง client ใหม่
    const newClient = new Client({
      name,
      email,
      password: hashPassword,
    });
    
    // บันทึกลงฐานข้อมูล
    await newClient.save();
    
    // ส่งผลลัพธ์กลับ
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// Controller สำหรับการเข้าสู่ระบบ
const loginClient = async (req, res) => {
  // รับข้อมูลจาก request body
  const { email, password } = req.body;

  try {
    // ค้นหา client จากอีเมล
    const checkClient = await Client.findOne({ email });
    if (!checkClient)
      return res.json({
        success: false,
        message: "Client doesn't exist! Please register first",
      });

    // ตรวจสอบรหัสผ่าน
    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkClient.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

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
    // เพิ่มข้อมูล client ใน request object
    req.client = decoded;

    console.log(req.client)
    
    // ดำเนินการต่อไปยัง middleware ถัดไป
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

export { registerClient, loginClient, logoutClient, authMiddleware };
