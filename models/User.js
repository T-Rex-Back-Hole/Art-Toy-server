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
    lowercase: true, // แปลงเป็นตัวพิมพ์เล็กก่อนบันทึก
    trim: true, // ลบช่องว่างที่เริ่มต้นและสิ้นสุด
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  cartData: { type: Object, default: {} },
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
