import express from "express";
import {
  addToCart,
  getUserCart,
  updateCart,
  removeCart
} from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/auth-controller.js";

const cartRouter = express.Router();

cartRouter.get("/get",authMiddleware, getUserCart);
cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/update", authMiddleware, updateCart);
cartRouter.delete("/removeItem", authMiddleware, removeCart);

export default cartRouter;
