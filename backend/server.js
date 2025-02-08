const express = require("express"); 
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const multer = require("multer"); // เพิ่มการใช้งาน multer สำหรับอัปโหลดไฟล์

const app = express();
app.use(cors());
app.use(express.json());

// ตั้งค่าการจัดเก็บไฟล์ภาพ
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // กำหนดให้เก็บไฟล์ในโฟลเดอร์ uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // ตั้งชื่อไฟล์ที่ไม่ซ้ำกัน
  }
});

const upload = multer({ storage: storage });

// เชื่อมต่อ MongoDB และกำหนดฐานข้อมูลเป็น SE
mongoose.connect(process.env.MONGO_URI, { dbName: 'SE' })
  .then(() => console.log("MongoDB Connected to SE database"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// Route สำหรับการลงทะเบียน
app.post("/api/register", upload.single('profileImage'), async (req, res) => {
  const { username, email, password, firstName, lastName, bank, accountNumber } = req.body;
  const profileImage = req.file ? req.file.path : null; // กรณีมีการอัปโหลดไฟล์

  try {
    // ตรวจสอบว่าอีเมลหรือชื่อผู้ใช้มีการใช้แล้วหรือไม่
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log(`Username or email already exists: ${username} / ${email}`);
      return res.status(400).json({ message: "Username or email already exists" });
    }

    // เข้ารหัสรหัสผ่านก่อนบันทึก
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // ใช้รหัสผ่านที่ถูกเข้ารหัส
      firstName,
      lastName,
      bank,
      accountNumber,
      profileImage, // เพิ่มไฟล์โปรไฟล์ภาพ
    });

    // บันทึกผู้ใช้ใหม่ลงใน MongoDB
    await newUser.save();
    console.log(`New user registered: ${username} / ${email}`);  // แจ้งเตือนที่ cmd

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Server error: ", error);  // แจ้งเตือนเมื่อเกิดข้อผิดพลาด
    res.status(500).json({ message: "Server error", error });
  }
});

// Route สำหรับดึงข้อมูลผู้ใช้ทั้งหมด
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();  // ดึงข้อมูลผู้ใช้ทั้งหมดจากฐานข้อมูล
    res.status(200).json(users);  // ส่งข้อมูลผู้ใช้ทั้งหมดกลับไปยัง client
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
const fs = require('fs');
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  // แจ้งเตือนเมื่อเซิร์ฟเวอร์เริ่มทำงาน
