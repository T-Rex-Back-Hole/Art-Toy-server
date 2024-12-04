import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth/auth-routes.js";
import dotenv from "dotenv";

// Correcting the typo
dotenv.config();

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// Connect to MongoDB
mongoose
  .connect(DB)
  .then(() => {
    console.log("MongoDB Connection Successful!");
  })
  .catch((error) => console.log("Failed to connect MongoDB:", error));

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend origin
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true, // Allow cookies
  })
);

app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse incoming JSON
app.use("/api/auth", authRouter); // Use authRouter for authentication routes

// Start the server
app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));