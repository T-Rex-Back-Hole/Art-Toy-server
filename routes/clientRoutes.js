import express from "express";
import {
  register,
  login,
  getUserData,
} from "../controllers/clientController.js"; // ตรวจสอบว่ามีการใช้งานฟังก์ชั่นที่ export ถูกต้องจาก controller


const clientRouter = express.Router();

clientRouter.post("/register", registerClient);
clientRouter.post("/login", loginClient);
clientRouter.post("/logout", logoutClient);

export default clientRouter;
