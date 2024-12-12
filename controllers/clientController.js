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

    await newUser.save();
    console.log("User created successfully:", newUser._id);

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
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        userName: user.userName 
      },
      process.env.CLIENT_SECRET_KEY,
      { expiresIn: "1d" }
    );

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
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login"
    });
  }
};

export const logoutClient = (req, res) => {
  try{
    res.clearCookie("token");
    return res.status(200).json({ 
      success: true, 
    message: "Logout successful.😎 😎 😎"
   });
  } catch (error) {
    console.error("Logout error", error);
    return res.status(500).json({
      success: false,
      message: "Error logging out"
    });
  }
};

export const getClientProfile = async (req, res) => {
  try {
    const userID = req.client.id;
    console.log('UserID:', userID);
    
    // ดึงข้อมูลผู้ใช้โดยไม่รวมรหัสผ่าน
    const user = await User.findById(userID).select('-password');
    console.log('User found:', user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

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
    });
  }
};

