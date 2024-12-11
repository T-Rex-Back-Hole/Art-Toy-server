import express from "express";
import {
  placeOrderStripe,
  userOrders,
  verifyStripe,
} from "../controllers/orderController.js";

import { authMiddleware } from "../middleware/auth-controller.js";

const orderRouter = express.Router();

// Payment Features
orderRouter.post("/stripe", authMiddleware, placeOrderStripe);

// User Feature
orderRouter.post("/userorders", authMiddleware, userOrders);

// verify payment
orderRouter.post("/verifyStripe", authMiddleware, verifyStripe);

export default orderRouter;
