const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Building = require("./models/buildings.js");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "SE",
  })
  .then(() => console.log("✅ MongoDB Connected to SE"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
  
/** ================================
 * ✅ GET: ดึงข้อมูลสนามทั้งหมด
 * ================================ */
app.get("/api/buildings", async (req, res) => {
  try {
    const buildings = await Building.find();
    if (!buildings || buildings.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    res.json(buildings.map((building) => building.toJSON()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** ================================
 * ✅ POST: เพิ่มอาคารใหม่
 * ================================ */
app.post("/api/buildings", async (req, res) => {
  try {
    const { type, building, courts } = req.body;
    if (!type || !building || !courts) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }
    const newBuilding = new Building({ type, building, courts });
    await newBuilding.save();
    res.status(201).json({ message: "เพิ่มข้อมูลสำเร็จ", building: newBuilding });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/update-buildings", async (req, res) => {
  const { Type, Building: buildingData } = req.body;
  if (!Type || !buildingData || Object.keys(buildingData).length === 0) {
    return res.status(400).json({ message: "❌ ข้อมูลไม่ครบถ้วน" });
  }
  try {
    const existingData = await Building.findOne({ Type: Type });
    if (!existingData) {
      return res.status(404).json({ message: "❌ ไม่พบข้อมูลที่ต้องการอัปเดต" });
    }
    let updateFields = {};
    Object.keys(buildingData).forEach((buildingKey) => {
      const existingBuilding = existingData.Building.get(buildingKey);
      if (existingBuilding) {  
        const fields = buildingData[buildingKey];
        Object.keys(fields).forEach((fieldKey) => {
          if (existingBuilding[fieldKey]) {
            updateFields[`Building.${buildingKey}.${fieldKey}.Booking`] = fields[fieldKey].Booking;
          }
        });
      }
    });
    const updatedData = await Building.findOneAndUpdate(
      { Type: Type },
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    res.json({ message: "✅ อัปเดต Booking สำเร็จ", result: updatedData });
  } catch (error) {
    res.status(500).json({ message: "❌ เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
});

/** ================================
 * ✅ DELETE: ลบอาคารตาม ID
 * ================================ */
app.delete("/api/buildings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBuilding = await Building.findByIdAndDelete(id);
    if (!deletedBuilding) {
      return res.status(404).json({ message: "ไม่พบอาคารที่ต้องการลบ" });
    }
    res.status(200).json({ message: "ลบข้อมูลสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** ================================
 * ✅ เปิดเซิร์ฟเวอร์
 * ================================ */
const PORT = process.env.PORT5 || 5005;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
