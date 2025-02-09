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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    // ป้องกันการเข้ารหัสซ้ำซ้อน
    if (!this.password.startsWith("$2a$")) { 
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.pre("findOneAndUpdate", async function (next) {
  if (!this._update.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this._update.password = await bcrypt.hash(this._update.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


const User = mongoose.model("User", userSchema);

module.exports = User;
