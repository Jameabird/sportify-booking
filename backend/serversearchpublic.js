require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
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

// 📌 API ดึงข้อมูลอาคารจากฐานข้อมูล (ไม่มี authentication แล้ว)
app.get("/api/buildings", async (req, res) => {
  try {
    const buildings = await Building.find();
    res.json(buildings);
  } catch (error) {
    console.error("🚨 Error fetching buildings:", error);
    res.status(500).json({ message: "Failed to fetch buildings" });
  }
});

const PORT = process.env.PORT10 || 4010;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
