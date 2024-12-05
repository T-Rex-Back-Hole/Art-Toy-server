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
    // lowercase: true,
    // match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/],
  },
  password: {
    type: String,
    required: true,
    // minlength: [8],
    // select: false,
  },
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },
  // passwordChangedAt: Date,
  // active: {
  //   type: Boolean,
  //   default: true,
  //   select: false,
  // },
  role: {
    type: String,
    enum: ["admin", "user"],
  },
  // address: {
  //   fullname: { type: String, required: true },
  //   phoneNumber: { type: String, required: true },
  //   province: { type: String, required: true },
  //   subDistrict: { type: String, required: true },
  //   district: { type: String, required: true },
  //   postal: { type: String, required: true },
  // },
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
