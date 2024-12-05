import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB ✅");
    });
    await mongoose.connect(`${DB}`);
  } catch (error) {
    console.error("Error connecting to MongoDB ❌", error.message);
  }
};

export default connectDB;
