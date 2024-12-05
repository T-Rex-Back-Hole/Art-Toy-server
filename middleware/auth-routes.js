import express from "express";
import {
  registerClient,
  loginClient,
  logoutClient,
  authMiddleware,
} from "./auth-controller.js";

const router = express.Router();

router.post("/register", registerClient);
router.post("/login", loginClient);
router.post("/logout", logoutClient);
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

export default router;
