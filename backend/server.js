const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // ใช้สำหรับสร้าง JWT token
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // กำหนด origin เฉพาะ
    credentials: true, // อนุญาตให้ cookies หรือ headers ที่จำเป็นถูกส่งไปกับคำขอ
  })
);
app.use(express.json());

// Middleware สำหรับตรวจสอบ JWT
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    console.log("🔹 Received Token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔹 Decoded JWT:", decoded);

    if (!decoded.userId) {
      throw new Error("Invalid token payload: Missing userId");
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("🚨 JWT Authentication Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired, please log in again" });
    }

    return res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

// ✅ สร้าง Owner ใหม่ โดยต้องเป็น Admin เท่านั้น
app.post("/api/owners", authenticate, async (req, res) => {
  try {
    const { name, email, password, phoneNumber, firstName, lastName, bank, accountNumber} = req.body; // รับ phoneNumber จาก body
    const adminId = req.user.userId; // ดึงจาก JWT

    // ตรวจสอบว่า admin มีสิทธิ์หรือไม่
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ error: "Permission denied: Only admins can create owners" });
    }

    // ตรวจสอบว่าอีเมลนี้ถูกใช้แล้วหรือไม่
    const existingOfficerByEmail = await User.findOne({ email });
    if (existingOfficerByEmail) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // ตรวจสอบว่า username นี้ถูกใช้แล้วหรือไม่
    const existingOfficerByUsername = await User.findOne({ username: name });
    if (existingOfficerByUsername) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // Hash รหัสผ่านก่อนบันทึก
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง Owner ใหม่
    const newOwner = new User({
      username: name,
      email,
      password: hashedPassword,
      role: "owner",
      phoneNumber: phoneNumber, // เพิ่มฟิลด์นี้ในข้อมูลที่บันทึก
      firstName, 
      lastName, 
      bank,
      accountNumber,
      adminId,
      createdAt: new Date(),
    });

    await newOwner.save();
    res.status(201).json(newOwner);
  } catch (error) {
    console.error("Error creating owner:", error);
    res.status(500).json({ error: "Failed to create owner" });
  }
});

// ✅ ดึง Owner ทั้งหมดที่อ้างอิง adminId (Admin เท่านั้น)
app.get("/api/owners", authenticate, async (req, res) => { // เพิ่ม `/api` ใน path
  try {
    const adminId = req.user.userId; // ดึงจาก JWT

    // ตรวจสอบสิทธิ์ว่าเป็น admin จริงหรือไม่
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ error: "Permission denied" });
    }

    const owners = await User.find({ adminId });
    res.status(200).json(owners);
  } catch (error) {
    console.error("Error fetching owners:", error);
    res.status(500).json({ error: "Failed to fetch owners" });
  }
});

// ✅ อัปเดตข้อมูล Owner (Admin เท่านั้น)
app.put("/api/owners/:ownerId", authenticate, async (req, res) => { // เพิ่ม `/api` ใน path
  try {
    const { ownerId } = req.params;
    const updates = req.body;
    const adminId = req.user.userId;

    // ตรวจสอบสิทธิ์ว่าเป็น Admin จริงหรือไม่
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ error: "Permission denied" });
    }

    // ตรวจสอบว่า ownerId มีอยู่จริงและเป็นของ admin นี้หรือไม่
    const owner = await User.findOne({ _id: ownerId, adminId });
    if (!owner) {
      return res.status(404).json({ error: "Owner not found or unauthorized" });
    }

    // อัปเดตข้อมูล Owner
    Object.assign(owner, updates);
    await owner.save();

    res.status(200).json(owner);
  } catch (error) {
    console.error("Error updating owner:", error);
    res.status(500).json({ error: "Failed to update owner" });
  }
});

// ✅ Route สำหรับลบ Owner
app.delete("/api/owners/:id", authenticate, async (req, res) => {
  try {
    const adminId = req.user.userId; // ดึง adminId จาก JWT token ที่ตรวจสอบแล้ว

    // ตรวจสอบว่า user ที่ส่งคำขอมีสิทธิ์เป็น admin หรือไม่
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ error: "Permission denied" });
    }

    const ownerId = req.params.id;

    // ลบข้อมูล Owner โดยใช้ ID
    const owner = await User.findByIdAndDelete(ownerId);
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // ส่ง response กลับเมื่อการลบสำเร็จ
    res.status(200).json({ message: "Owner deleted successfully" });
  } catch (error) {
    console.error("Error deleting owner:", error);
    res.status(500).json({ error: "Failed to delete owner" });
  }
});

// ✅ สร้าง Officer ใหม่ โดยต้องมี ownerId จาก owner
app.post("/api/officers", authenticate, async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const ownerId = req.user.userId; // ดึง ownerId จาก JWT

    // ตรวจสอบว่า user เป็น owner หรือไม่
    const owner = await User.findById(ownerId);
    if (!owner || owner.role !== "owner") {
      return res.status(403).json({ error: "Permission denied: Only owners can create officers" });
    }

    // ตรวจสอบว่าอีเมลนี้ถูกใช้แล้วหรือไม่
    const existingOfficerByEmail = await User.findOne({ email });
    if (existingOfficerByEmail) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // ตรวจสอบว่า username นี้ถูกใช้แล้วหรือไม่
    const existingOfficerByUsername = await User.findOne({ username: name });
    if (existingOfficerByUsername) {
      return res.status(400).json({ error: "Username is already taken" });
    }
    
    // Hash รหัสผ่านก่อนบันทึก
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง Officer ใหม่
    const newOfficer = new User({
      username: name,
      email,
      password: hashedPassword,
      role: "officer",
      phoneNumber: phoneNumber,
      ownerId,  // เก็บ ownerId ใน officer
      createdAt: new Date(),
    });

    await newOfficer.save();
    res.status(201).json(newOfficer);
  } catch (error) {
    console.error("Error creating officer:", error);
    res.status(500).json({ error: "Failed to create officer" });
  }
});

// ✅ ดึง Officer ทั้งหมดโดยอ้างอิง ownerId
app.get("/api/officers", authenticate, async (req, res) => {
  try {
    const ownerId = req.user.userId; // ดึงจาก JWT 

    // ตรวจสอบว่าเป็น owner หรือไม่
    const owner = await User.findById(ownerId);
    if (!owner || owner.role !== "owner") {
      return res.status(403).json({ error: "Permission denied: Only owners can fetch officers" });
    }

    const officers = await User.find({ ownerId });
    res.status(200).json(officers);
  } catch (error) {
    console.error("Error fetching officers:", error);
    res.status(500).json({ error: "Failed to fetch officers" });
  }
});

// ✅ อัปเดตข้อมูล Officer
app.put("/api/officers/:officerId", authenticate, async (req, res) => {
  try {
    const { officerId } = req.params;
    const updates = req.body;
    const ownerId = req.user.userId; // ดึง ownerId จาก JWT

    // ตรวจสอบว่าเป็น owner หรือไม่
    const owner = await User.findById(ownerId);
    if (!owner || owner.role !== "owner") {
      return res.status(403).json({ error: "Permission denied: Only owners can update officers" });
    }

    // ตรวจสอบว่า officerId นี้ถูกอ้างอิงกับ ownerId หรือไม่
    const officer = await User.findOne({ _id: officerId, ownerId });
    if (!officer) {
      return res.status(404).json({ error: "Officer not found or unauthorized" });
    }

    // อัปเดตข้อมูล Officer
    Object.assign(officer, updates);
    await officer.save();

    res.status(200).json(officer);
  } catch (error) {
    console.error("Error updating officer:", error);
    res.status(500).json({ error: "Failed to update officer" });
  }
});

// ✅ ลบ Officer
app.delete("/api/officers/:officerId", authenticate, async (req, res) => {
  try {
    const { officerId } = req.params;
    const ownerId = req.user.userId; // ดึง ownerId จาก JWT

    // ตรวจสอบว่าเป็น owner หรือไม่
    const owner = await User.findById(ownerId);
    if (!owner || owner.role !== "owner") {
      return res.status(403).json({ error: "Permission denied: Only owners can delete officers" });
    }

    // ตรวจสอบว่า officerId นี้ถูกอ้างอิงกับ ownerId หรือไม่
    const officer = await User.findOne({ _id: officerId, ownerId });
    if (!officer) {
      return res.status(404).json({ error: "Officer not found or unauthorized" });
    }

    // ลบ Officer
    await officer.deleteOne();

    res.status(200).json({ message: "Officer deleted successfully" });
  } catch (error) {
    console.error("Error deleting officer:", error);
    res.status(500).json({ error: "Failed to delete officer" });
  }
});

// ใช้ route ที่ต้องการ authentication
app.get("/api/users/me", authenticate, async (req, res) => {
  try {
    console.log("🔹 Request received in /api/users/me");
    console.log("🔹 Decoded Token User:", req.user);

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized: No user data found in token" });
    }

    const user = await User.findById(req.user.userId); // เปลี่ยนจาก req.user.id เป็น req.user.userId

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("🚨 Error in /api/users/me:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// ✅ อัปเดตข้อมูลโปรไฟล์
app.put("/api/users/me", authenticate, async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const userId = req.user.userId; // ดึง user ID จาก token
    // ค้นหาผู้ใช้
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ อัปเดตเฉพาะฟิลด์ที่ถูกส่งมา
    const allowedFields = [
      "username",
      "phoneNumber",
      "firstName",
      "lastName",
      "bank",
      "accountNumber",
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save(); // บันทึกข้อมูลลง MongoDB
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/users/me/reset-password", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // ค้นหาผู้ใช้
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ตรวจสอบว่ารหัสผ่านเดิมถูกต้องหรือไม่
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // ตรวจสอบรหัสผ่านใหม่และยืนยันรหัสผ่าน
    if (!newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Please provide new password and confirm password" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    // ตรวจสอบความแข็งแกร่งของรหัสผ่าน
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res
        .status(400)
        .json({
          message:
            "New password must contain at least one uppercase letter, one number, and one special character.",
        });
    }

    // แฮชรหัสผ่านใหม่
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;

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
  async (req, res) => {
    try {
      console.log("Received form data:", req.body);

      const {
        username,
        email,
        password,
        firstName,
        lastName,
        bank,
        accountNumber,
        role = "user",
      } = req.body;

      if (!username || !email || !password || !role) {
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
        role,
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

    // สร้าง JWT token ด้วย method generateAuthToken
    const token = user.generateAuthToken(); // เรียกใช้ generateAuthToken

    res
      .status(200)
      .json({ message: "เข้าสู่ระบบสำเร็จ!", token, role: user.role });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post(
  "/api/google-login",
  async (req, res) => {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    try {
      console.log("🔹 Received Token:", token);

      if (!process.env.GOOGLE_CLIENT_ID) {
        throw new Error("Missing GOOGLE_CLIENT_ID in environment variables");
      }

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      console.log("🔹 Google Payload:", payload);

      if (!payload || !payload.email) {
        throw new Error("Invalid Google token payload");
      }

      // ✅ ตรวจสอบว่าผู้ใช้เคยลงทะเบียนด้วย email/password หรือไม่
      let user = await User.findOne({ email: payload.email });

      if (user && user.authProvider !== "google") {
        return res.status(400).json({ message: "Email นี้เคยลงทะเบียนแบบปกติ กรุณาใช้วิธี login เดิม" });
      }

      if (!user) {
        user = new User({
          username: payload.name || payload.email.split("@")[0],
          email: payload.email,
          firstName: payload.given_name || "",
          lastName: payload.family_name || "",
          role: "user",
          phoneNumber: "", // ใส่ค่าเริ่มต้นชั่วคราว
          accountNumber: "", // ใส่ค่าเริ่มต้นชั่วคราว
          password: "google-auth", // ใส่ค่าเริ่มต้นชั่วคราว (อาจใช้ Hashing ทีหลัง)
          authProvider: "google", // ระบุว่าผู้ใช้มาจาก Google Login
        });
        await user.save();
        console.log("✅ New user created:", user);
      } else {
        console.log("✅ User found:", user);
      }

      const jwtToken = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      console.log("✅ JWT Token Created:", jwtToken);

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
  }
);

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

    // เช็คว่า authProvider เป็น Google หรือไม่
    if (user.authProvider === "google") {
      return res.status(400).json({ 
        message: "ไม่สามารถดำเนินการรีเซ็ตรหัสผ่านสำหรับบัญชีนี้ได้ กรุณาเข้าสู่ระบบด้วยวิธีที่คุณใช้ลงทะเบียน" 
      });
    }

    // เช็ค role ถ้าเป็น officer, owner, admin ให้แจ้งเตือนแบบไม่ระบุเจาะจง
    const restrictedRoles = ["officer", "owner", "admin"];
    if (restrictedRoles.includes(user.role)) {
      return res.status(400).json({ 
        message: "ไม่สามารถดำเนินการรีเซ็ตรหัสผ่านสำหรับบัญชีนี้ได้ โปรดติดต่อผู้ดูแลระบบหากคุณต้องการความช่วยเหลือ" 
      });
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // แจ้งเตือนเมื่อเซิร์ฟเวอร์เริ่มทำงาน
