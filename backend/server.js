const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const jwt = require("jsonwebtoken"); // ใช้สำหรับสร้าง JWT token
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // กำหนด origin เฉพาะ
    credentials: true, // อนุญาตให้ cookies หรือ headers ที่จำเป็นถูกส่งไปกับคำขอ
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ตั้งค่าการจัดเก็บไฟล์ profileImage ที่ path uploads/profile
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// ตั้งค่าการจัดเก็บไฟล์ bankImage ที่ path uploads/bank
const bankStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/bank");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ dest: "uploads/" });

// ตั้งค่าการเชื่อมต่อกับ nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // อีเมลผู้ส่ง
    pass: process.env.EMAIL_PASS, // รหัสผ่านอีเมลผู้ส่ง
  },
});

// เชื่อมต่อ MongoDB
mongoose
  .connect(process.env.MONGO_URI, { dbName: "SE" })
  .then(() => console.log("MongoDB Connected to SE database"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Route สำหรับการลงทะเบียน
app.post(
  "/api/register",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "bankImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("Received form data:", req.body);
      console.log("Uploaded files:", req.files);

      const {
        username,
        email,
        password,
        firstName,
        lastName,
        bank,
        accountNumber,
      } = req.body;

      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ message: "กรุณากรอก Username, Email และ Password ให้ครบ" });
      }

      // บังคับให้ email เป็นตัวพิมพ์เล็กทั้งหมด
      const normalizedEmail = email.toLowerCase();

      // ตรวจสอบรูปแบบอีเมล
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "อีเมลไม่ถูกต้อง" });
      }

      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Username หรือ email นี้ถูกใช้งานไปแล้ว" });
      }

      // เช็คไฟล์อัปโหลด
      const profileImage = req.files.profileImage ? req.files.profileImage[0].path : null;
      const bankImage = req.files.bankImage ? req.files.bankImage[0].path : null;
      console.log("profileImage path:", profileImage);
      console.log("bankImage path:", bankImage);

      const hashedPassword = await bcrypt.hash(password, 10);

      // สร้าง object สำหรับบันทึกข้อมูล
      const newUser = new User({
        username,
        email: normalizedEmail,
        password: hashedPassword,
        firstName: firstName || undefined, // ป้องกันการบันทึกค่าว่าง
        lastName: lastName || undefined, // ป้องกันการบันทึกค่าว่าง
        bank: bank || undefined,
        accountNumber: accountNumber || undefined, // ป้องกันการบันทึกค่าว่าง
        profileImage,
        bankImage,
      });

      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("❌ Server error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

app.post("/api/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log("Received email:", email); // พิมพ์ email ที่รับมา
    console.log("Received password:", password); // พิมพ์ password ที่รับมา

    // ลบช่องว่างออกจากอีเมลและรหัสผ่าน (เพื่อหลีกเลี่ยงการป้อนค่าที่มีช่องว่าง)
    email = email.trim().toLowerCase();
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

    // เปรียบเทียบรหัสผ่านที่ผู้ใช้ป้อนกับรหัสผ่านที่เก็บไว้ในฐานข้อมูล
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

    res
      .status(200)
      .json({ message: "เข้าสู่ระบบสำเร็จ!", token, role: user.role });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

app.post("/api/google-login", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    console.log("🔹 Received Token:", token);

    // ตรวจสอบว่า GOOGLE_CLIENT_ID ถูกต้องหรือไม่
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error("Missing GOOGLE_CLIENT_ID in environment variables");
    }

    // ตรวจสอบ Token ที่ได้รับจาก Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("🔹 Google Payload:", payload);

    if (!payload || !payload.email) {
      throw new Error("Invalid Google token payload");
    }

    // ตรวจสอบว่า user มีในระบบหรือไม่
    let user = await User.findOne({ email: payload.email });

    if (!user) {
      // ถ้าไม่มีผู้ใช้ในระบบ ให้ลงทะเบียนใหม่
      user = new User({
        username: payload.name || payload.email.split("@")[0],
        email: payload.email,
        firstName: payload.given_name || "",
        lastName: payload.family_name || "Unknown", // กำหนดค่าเริ่มต้น
        profileImage: payload.picture || "",
        role: "user",
        phoneNumber: "0000000000", // ใส่ค่าเริ่มต้นชั่วคราว
        accountNumber: "Unknown", // ใส่ค่าเริ่มต้นชั่วคราว
        password: "google-auth", // ใส่ค่าเริ่มต้นชั่วคราว (อาจใช้ Hashing ทีหลัง)
        authProvider: "google", // ระบุว่าผู้ใช้มาจาก Google Login
      });
      await user.save();
      console.log("✅ New user created:", user);
    } else {
      console.log("✅ User found:", user);
    }

    // สร้าง JWT token สำหรับผู้ใช้
    const jwtToken = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ JWT Token Created:", jwtToken);

    // ส่ง JWT token กลับไปยัง frontend
    res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ!",
      token: jwtToken,
      role: user.role,
    });
  } catch (error) {
    console.error("🚨 Google Login Error:", error.message);
    res.status(500).json({
      message: "ไม่สามารถเข้าสู่ระบบผ่าน Google ได้",
      error: error.message,
    });
  }
});

// Route สำหรับรีเซ็ตรหัสผ่าน
app.post("/api/forget-password", async (req, res) => {
  let { email } = req.body;
  email = email.toLowerCase();

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // สร้างรหัสรีเซ็ต
  const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // รหัสรีเซ็ตหมดอายุใน 5 นาที

  try {
    // ตรวจสอบอีเมลในฐานข้อมูล
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("ไม่พบอีเมลนี้ในระบบ กรุณาตรวจสอบอีกครั้ง");
    }

    // อัปเดตรหัสรีเซ็ตและเวลาหมดอายุในฐานข้อมูล
    user.resetCode = resetCode;
    user.resetCodeExpires = expiryTime;
    await user.save();

    // ส่งอีเมล
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Code",
      text: `Your reset code is: ${resetCode}. It will expire in 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Error sending email");
      } else {
        console.log("Email sent: " + info.response);
        res.send("Reset code sent to email");
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("เกิดข้อผิดพลาดบนเซิร์ฟเวอร์");
  }
});

// Route สำหรับตรวจสอบ OTP
app.post("/api/verify-otp", async (req, res) => {
  const { otp } = req.body;

  if (!otp || otp.length !== 6) {
    return res.status(400).send("กรุณากรอก OTP 6 หลักที่ถูกต้อง");
  }

  try {
    // ค้นหาผู้ใช้ที่มีรหัสรีเซ็ตรหัสผ่าน
    const user = await User.findOne({ resetCode: otp });

    if (!user) {
      return res.status(404).send("OTP ไม่ถูกต้อง");
    }

    // ตรวจสอบว่า OTP หมดอายุหรือไม่
    const currentTime = new Date();
    if (user.resetCodeExpires < currentTime) {
      return res.status(400).send("OTP หมดอายุแล้ว");
    }

    // ถ้า OTP ถูกต้องและยังไม่หมดอายุ
    res.status(200).send("OTP ถูกต้อง");
  } catch (error) {
    console.error(error);
    res.status(500).send("เกิดข้อผิดพลาดในการตรวจสอบ OTP");
  }
});

// Route สำหรับรีเซ็ตรหัสผ่าน
app.post("/api/reset-password", async (req, res) => {
  const { otp, newPassword, confirmPassword } = req.body;

  // ตรวจสอบ OTP
  if (!otp || otp.length !== 6) {
    return res.status(400).send("กรุณากรอก OTP 6 หลักที่ถูกต้อง");
  }

  // ตรวจสอบรหัสผ่านใหม่และยืนยันรหัสผ่าน
  if (!newPassword || !confirmPassword) {
    return res.status(400).send("กรุณากรอกรหัสผ่านใหม่และยืนยันรหัสผ่าน");
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).send("รหัสผ่านไม่ตรงกัน");
  }

  // ตรวจสอบความแข็งแกร่งของรหัสผ่าน (ตัวพิมพ์ใหญ่, ตัวเลข, อักขระพิเศษ)
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res
      .status(400)
      .send(
        "รหัสผ่านต้องมีตัวพิมพ์ใหญ่, ตัวเลข, และอักขระพิเศษอย่างน้อย 1 ตัว"
      );
  }

  try {
    // ค้นหาผู้ใช้ที่มีรหัสรีเซ็ตรหัสผ่าน
    const user = await User.findOne({ resetCode: otp });

    if (!user) {
      return res.status(404).send("OTP ไม่ถูกต้อง");
    }

    // ตรวจสอบว่า OTP หมดอายุหรือไม่
    const currentTime = new Date();
    if (user.resetCodeExpires < currentTime) {
      return res.status(400).send("OTP หมดอายุแล้ว");
    }

    // รีเซ็ตรหัสผ่านใหม่โดยการแฮชรหัสผ่าน
    const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 คือจำนวนรอบในการแฮช

    // บันทึกรหัสผ่านใหม่และลบ OTP
    user.password = hashedPassword;
    user.resetCode = null; // ลบรหัส OTP
    user.resetCodeExpires = null; // ลบเวลา OTP หมดอายุ

    // บันทึกรหัสผ่านใหม่ลงในฐานข้อมูล
    await user.save();

    res.status(200).send("รีเซ็ตรหัสผ่านสำเร็จ");
  } catch (error) {
    console.error(error);
    res.status(500).send("เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน");
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
