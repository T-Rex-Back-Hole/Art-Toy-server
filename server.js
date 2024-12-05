import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./middleware/auth-routes.js";
import connectDB from "./config/mongodb.js";
import products from "./routes/productRoutes.js"
import cart from "./routes/cartRoutes.js"
// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "https://admin-test-deploy.vercel.app",
  "https://test-user-deploy.vercel.app",
  "http://localhost:5173", // For local development
  "http://localhost:5175", // For local development
];

// CORS configuration
app.use(
  cors({
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

app.get("/", (req, res) => {
  res.send("API Work 😎 😎 😎");
});

app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse incoming JSON
app.use("/auth", authRouter); // Use authRouter for authentication routes
// GET ALL PRODUCT
app.use("/products", products)
// GET ALL CART
app.use("/cart", cart)
// Start the server
app.listen(PORT, () =>
  console.log(`Server is now running on port ${PORT} 😎 😎 😎`)
);
