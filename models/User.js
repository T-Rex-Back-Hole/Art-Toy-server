import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
  },
  address: {
    fullname: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    province: { type: String, required: true },
    subDistrict: { type: String, required: true },
    district: { type: String, required: true },
    postal: { type: String, required: true },
  },
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
