const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const jwt = require("jsonwebtoken"); // ใช้สำหรับสร้าง JWT token

const app = express();
app.use(
  cors({
    origin: "*", // ตั้งค่า frontend ที่จะเข้าใช้งาน backend
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

bcrypt.compare(password, hashedPassword)
  .then(isMatch => {
    console.log(isMatch ? "✅ Password matches!" : "❌ Password mismatch!");
  })
  .catch(error => console.error("Error:", error));

// ตั้งค่าการจัดเก็บไฟล์ภาพ
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// เชื่อมต่อ MongoDB
mongoose
  .connect(process.env.MONGO_URI, { dbName: "SE" })
  .then(() => console.log("MongoDB Connected to SE database"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Route สำหรับการลงทะเบียน
app.post("/api/register", upload.single("profileImage"), async (req, res) => {
  try {
    console.log("Received form data:", req.body);
    console.log("Uploaded file:", req.file);

    const {
      username,
      email,
      password,
      firstName,
      lastName,
      bank,
      accountNumber,
    } = req.body;

    // ตรวจสอบรูปแบบอีเมล
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "อีเมลไม่ถูกต้อง" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username หรือ email นี้ถูกใช้งานไปแล้ว" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImage = req.file ? req.file.path : null;

    if (
      !username ||
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !bank ||
      !accountNumber
    ) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบทุกฟิลด์" });
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      bank,
      accountNumber,
      profileImage,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log("Received email:", email); // พิมพ์ email ที่รับมา
    console.log("Received password:", password); // พิมพ์ password ที่รับมา

    // ลบช่องว่างออกจากอีเมลและรหัสผ่าน (เพื่อหลีกเลี่ยงการป้อนค่าที่มีช่องว่าง)
    email = email.trim();
    password = password.trim();

    // ตรวจสอบว่าอีเมลและรหัสผ่านไม่ว่าง
    if (!email || !password) {
      return res.status(400).json({ message: "กรุณากรอกอีเมลและรหัสผ่าน" });
    }

    // ค้นหาผู้ใช้ในฐานข้อมูล
    const user = await User.findOne({ email: email }); // ค้นหาตามอีเมลที่ได้รับ
    console.log("Found user:", user);
    if (!user) {
      return res.status(400).json({ message: "ข้อมูลรหัสผู้ใช้ไม่ถูกต้อง" });
    }

    // ตรวจสอบรหัสผ่าน
    console.log("Password received:", password);
    console.log("Hashed password from database:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ message: "ข้อมูลรหัสผู้ใช้ไม่ถูกต้อง" });
    }

    console.log("Password matches successfully!");

    // สร้าง JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ!", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


// Route สำหรับดึงข้อมูลผู้ใช้ทั้งหมด
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
const fs = require("fs");
const uploadsDir = "./uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // แจ้งเตือนเมื่อเซิร์ฟเวอร์เริ่มทำงาน
