const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Building = require("./models/buildings.js"); // ✅ Correct Model

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "SE", // ✅ Check that this matches your database in MongoDB Compass
  })
  .then(() => console.log("MongoDB Connected to SE"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ GET all buildings
app.get("/api/buildings", async (req, res) => {
    try {
      const buildings = await Building.find();
      if (!buildings || buildings.length === 0) {
        return res.status(404).json({ message: "No data found" });
      }
  
      res.json(buildings.map(building => building.toJSON())); // ✅ Convert Map to JSON
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// ✅ POST new building
app.post("/api/buildings", async (req, res) => {
  try {
    const { Type, Building } = req.body;
    if (!Type || !Building) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const newBuilding = new Building({ Type, Building });

    await newBuilding.save();
    res.status(201).json({ message: "เพิ่มข้อมูลสำเร็จ", building: newBuilding });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE a building by ID
app.put("/api/update-buildings", async (req, res) => {
  try {
    const { type, building, fieldId, booking } = req.body;

    if (!type || !building || !fieldId || typeof booking !== "boolean") {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    // ค้นหาเอกสารที่ตรงกับ `type` และ `building`
    const existingBuilding = await Building.findOne({ Type: type, [`Building.${building}`]: { $exists: true } });

    if (!existingBuilding) {
      return res.status(404).json({ message: "ไม่พบอาคารนี้" });
    }

    // อัปเดตค่า `booking` ในฟิลด์ที่เลือก
    existingBuilding.Building[building][fieldId].Booking = booking;

    await existingBuilding.save();
    res.status(200).json({ message: "อัปเดตสถานะ booking สำเร็จ", updatedBuilding: existingBuilding });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ DELETE a building by ID
app.delete("/api/buildings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Building.findByIdAndDelete(id);
    res.status(200).json({ message: "ลบข้อมูลสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT5 || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
