import express from "express";
import {
  register,
  login,
  getUserData,
} from "../controllers/clientController.js"; // ตรวจสอบว่ามีการใช้งานฟังก์ชั่นที่ export ถูกต้องจาก controller

const router = express.Router();

router.post("/register", register); // Route สำหรับการลงทะเบียน
router.post("/login", login); // Route สำหรับการเข้าสู่ระบบ
router.get("/user", getUserData); // Route สำหรับดึงข้อมูลผู้ใช้

export default router;
