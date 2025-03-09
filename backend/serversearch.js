require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGO_URI, {
  dbName: "SE",
}).then(() => console.log("✅ MongoDB Connected to SE"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

mongoose.connection.once("open", async () => {
  console.log("🔗 Connected to Database:", mongoose.connection.name);
  
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("🔗 Available Collections:", collections.map(c => c.name));
});

// 📌 สร้าง Mongoose Schema สำหรับ Buildings
const buildingSchema = new mongoose.Schema({
  name: String,
  image: String,
  location: String, // จังหวัด
});

const Building = mongoose.model("Building", buildingSchema);

// 📌 Middleware ตรวจสอบ JWT Token
const authenticate = (req, res, next) => {
  let token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token && req.body.token) {
    token = req.body.token;
  }

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

// 📌 API ดึงข้อมูลอาคารจากฐานข้อมูล
app.get("/api/buildings", authenticate, async (req, res) => {
  try {
    const buildings = await Building.find();
    res.json(buildings);
  } catch (error) {
    console.error("🚨 Error fetching buildings:", error);
    res.status(500).json({ message: "Failed to fetch buildings" });
  }
});

const PORT = process.env.PORT8 || 4005;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
