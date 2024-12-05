import express from "express";
import {
  loginClient,
  registerUser,
  clientLogin,
} from "../controllers/clientController.js";

const clientRouter = express.Router();

clientRouter.post("/register", registerUser);
clientRouter.post("/login", loginClient);
clientRouter.post("/client", clientLogin);

export default clientRouter;