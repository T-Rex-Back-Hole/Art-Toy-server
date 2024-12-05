import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const clientSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'กรุณากรอกชื่อ']
  },
  email: { 
    type: String, 
    required: [true, 'กรุณากรอกอีเมล'],
    unique: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'กรุณากรอกอีเมลที่ถูกต้อง']
  },
  password: { 
    type: String, 
    required: [true, 'กรุณากรอกรหัสผ่าน'],
    minlength: [8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

const Client = mongoose.model("client", clientSchema);


export default Client;
