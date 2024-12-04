import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./middleware/auth-routes.js";
import connectDB from "./config/mongodb.js";
// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: "https://t-rax-black-hole.vercel.app", // Your frontend origin
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
app.listen(PORT, () => console.log(`Server is now running on port ${PORT} 😎 😎 😎`));
