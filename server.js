import express from "express";
import connectDB from "./config/mongodb.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import clientRouter from "./routes/clientRoutes.js";
import productRouter from "./routes/productRoutes.js";
import adminProductsRouter from "./routes/admin/products-routes.js";
import dotenv from "dotenv"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
// Middleware

const allowedOrigins = [
  "https://t-rax-black-hole.vercel.app",
  "https://test-user-deploy.vercel.app",
  "http://localhost:5173", // For local development
  "http://localhost:5175", // For local development
];
app.use(
  cors({
    credentials: true, // Allow cookies
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/client", clientRouter);
//All Product
app.use("/products", productRouter);
// admin product
app.use("/adminProducts", adminProductsRouter);

// app.use("/api/auth", authRouter);
// app.use("/api/admin/products", adminProductsRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT} 😎 😎 😎 `));
