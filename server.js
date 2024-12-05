const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const dotenv = require("dotenv");

dotenv.config({path: './.env'})

/*const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD).replace('<USERNAME>', process.env.DATABASE_USERNAME);
mongoose.connect(DB).then(() =>{
console.log('DB Connections Successful!')
}).catch((error) => console.log(error));*/

mongoose
  .connect(
    process.env.DATABASE
  )
  .then(() => console.log("MongoDB connected Successful!"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));