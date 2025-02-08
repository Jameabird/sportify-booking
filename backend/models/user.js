const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");  // เรียกใช้ bcryptjs

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,  // ต้องเป็น unique
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,  // ต้องเป็น unique
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  bank: {
    type: String,
    enum: ['BAAC', 'SCB', 'K-Bank', 'Krungthai', 'TTB'],
  },
  accountNumber: {
    type: String,
    required: true,
    maxlength: 10,
  },
  profileImage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// เพิ่มการเข้ารหัสรหัสผ่านก่อนบันทึก
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();  // ถ้ารหัสผ่านไม่ได้ถูกแก้ไข ไม่ต้องทำการเข้ารหัสใหม่
  
  try {
    const salt = await bcrypt.genSalt(10); // สร้าง salt
    this.password = await bcrypt.hash(this.password, salt); // เข้ารหัสรหัสผ่าน
    next(); // เรียก next() เพื่อให้กระบวนการ save ต่อไป
  } catch (error) {
    next(error); // ถ้ามีข้อผิดพลาดในการเข้ารหัส ให้ส่งข้อผิดพลาด
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
