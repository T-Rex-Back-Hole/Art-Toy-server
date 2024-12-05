import express from "express";
import {
  registerClient,
  loginClient,
} from "./auth-controller.js";

const router = express.Router();

router.post("/register", registerClient);

router.post("/login", loginClient);

module.exports = router;
