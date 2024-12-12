import express from "express";
import { authMiddleware } from "../middleware/auth-controller.js";
import {
  registerClient,
  loginClient,
  logoutClient,
  getClientProfile,
  changePassword,
} from "../controllers/clientController.js";

const clientRouter = express.Router();

clientRouter.post("/register", registerClient);
clientRouter.post("/login", loginClient);
clientRouter.post("/logout", logoutClient);
clientRouter.get("/profile", authMiddleware, getClientProfile);
clientRouter.post("/change-password", authMiddleware, changePassword);

export default clientRouter;
