const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Building = require("./models/buildings.js");
const jwt = require("jsonwebtoken");
const Place = require("./models/Place");

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
app.get("/api/bookings/current", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId; // Extract user ID from JWT
    console.log("🔹 Fetching current bookings for userId:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const objectId = new mongoose.Types.ObjectId(userId);
    const currentBookings = await BookingHistory.find({ "user._id": objectId });

    console.log("✅ Retrieved bookings:", currentBookings);
    res.json(currentBookings);
  } catch (error) {
    console.error("🚨 Error retrieving current bookings:", error.message);
    res.status(500).json({ message: "Error retrieving bookings", error: error.message });
  }
});

  
/** ================================
 * ✅ GET: ดึงข้อมูลสนามทั้งหมด
 * ================================ */
app.get("/api/buildings", async (req, res) => {
  try {
    const buildings = await Building.find();
    if (!buildings || buildings.length === 0) {
      console.log(buildings);
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

app.post("/api/Place", async (req, res) => {
  console.log("ข้อมูลที่รับมา:", req.body);

  const { type, name, location, link, details, image } = req.body;

  if (!type || !name || !location || !link || !details || !image) {
    return res.status(400).json({ error: "ข้อมูลไม่ครบ" });
  }

  try {
    const newPlace = new Place({ type, name, location, link, details, image });
    await newPlace.save();
    res.json({ message: "บันทึกสำเร็จ" });
  } catch (error) {
    res.status(500).json({ error: "เกิดข้อผิดพลาด" });
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
