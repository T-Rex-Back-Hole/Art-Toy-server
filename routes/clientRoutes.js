import express from "express";
import {
  registerClient,
  loginClient,
  logoutClient,
} from "../controllers/clientController.js";

const router = express.Router();

router.post("/register", registerClient);
router.post("/login", loginClient);
router.post("/logout", logoutClient);

export default router;
