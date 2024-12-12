import express from "express";
import { authMiddleware } from "../middleware/auth-controller.js";
import {
  registerClient,
  loginClient,
  logoutClient,
<<<<<<< HEAD
  getClientProfile
=======
  getClientProfile,
  changePassword,
>>>>>>> 89b9449632d12a197ecd01d7db213d99e66d6d34
} from "../controllers/clientController.js";
import { authMiddleware } from "../middleware/auth-controller.js";

const clientRouter = express.Router();

clientRouter.post("/register", registerClient);
clientRouter.post("/login", loginClient);
clientRouter.post("/logout", logoutClient);
clientRouter.get("/profile", authMiddleware, getClientProfile);
<<<<<<< HEAD

=======
clientRouter.post("/change-password", authMiddleware, changePassword);
>>>>>>> 89b9449632d12a197ecd01d7db213d99e66d6d34
export default clientRouter;
