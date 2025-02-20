const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");  // เรียกใช้ bcryptjs
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  bank: {
    type: String,
    enum: [
      'PromptPay', // พร้อมเพย์
      'BAAC', // เพื่อการเกษตรและสหกรณ์การเกษตร
      'SCB', // ไทยพาณิชย์
      'KBank', // กสิกรไทย
      'Krungthai', // กรุงไทย
      'TTB', // TTB
      'BBL', // กรุงเทพ
      'Krungsri', // กรุงศรีอยุธยา
      'Thanachart' // ธนชาต
    ],
    required: false,
  },
  accountNumber: {
    type: String,
    maxlength: 10,
  },
  profileImage: {
    type: String,
  },
  bankImage: {
    type: String,
    default: "",
  },
  phoneNumber: {
    type: String,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'],
    minlength: 10,
    maxlength: 10,
    required: false,
  },
  resetCode: {
    type: String,  // รหัสรีเซ็ต
  },
  resetCodeExpires: {
    type: Date,  // เวลาหมดอายุของรหัสรีเซ็ต
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ['user', 'officer', 'owner', 'admin'],
    default: 'user',
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function () {
      return this.role === "owner"; // ถ้าเป็น owner ต้องมี adminId
    },
  },  
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // เชื่อมโยงกับเจ้าของ
    required: function () {
      return this.role === "officer"; // ถ้าเป็น officer ต้องมี ownerId
    },
  },
});

// ฟังก์ชันตรวจสอบรหัสผ่านที่เข้ารหัสแล้ว
userSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);  // ใช้ bcrypt เพื่อเปรียบเทียบรหัสผ่าน
};

// ฟังก์ชันสร้าง JWT Token
userSchema.methods.generateAuthToken = function() {
  const payload = { userId: this._id, username: this.username, role: this.role }; // เปลี่ยน 'id' เป็น 'userId'
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // สร้าง token ด้วย secret key
  return token;
};

userSchema.pre("save", async function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase(); // ทำให้ email เป็นตัวพิมพ์เล็กทั้งหมด
  }

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
