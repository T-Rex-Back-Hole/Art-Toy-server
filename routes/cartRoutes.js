import express from "express";
import {
  addToCart,
  getUserCart,
  updateCart,
} from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/auth-controller.js";

const cartRouter = express.Router();

cartRouter.get("/get/:userId", getUserCart);
cartRouter.post("/add", addToCart);
cartRouter.post("/update", authMiddleware, updateCart);

export default cartRouter;
