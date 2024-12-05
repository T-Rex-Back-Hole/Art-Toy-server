import express from "express";
import {
  loginAdmin,
  logoutAdmin,
  registerAdmin
} from "../../controllers/admin/adminLogin.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/logout", logoutAdmin);
adminRouter.post("/register", registerAdmin);

export default adminRouter;