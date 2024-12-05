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

// เข้ารหัสพาสเวิร์ดก่อนบันทึก
clientSchema.pre('save', async function(next) {
  // ทำงานเฉพาะเมื่อมีการแก้ไขพาสเวิร์ด
  if (!this.isModified('password')) return next();
  
  // เข้ารหัสพาสเวิร์ดด้วย bcrypt
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// เมธอดสำหรับตรวจสอบรหัสผ่าน
clientSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// เมธอดสำหรับตรวจสอบว่ารหัสผ่านมีการเปลี่ยนแปลงหลังจาก token ถูกออกหรือไม่
clientSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const Client = mongoose.model("Client", clientSchema);

export default Client;
