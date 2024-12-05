import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import clientRouter from "./routes/clientRoutes.js";

dotenv.config({ path: "./.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log("DB Connection Successful! ✅ 😎👍"))
  .catch((error) => console.log("DB Connection Error:", error));

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/client", clientRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅ 😎`));
