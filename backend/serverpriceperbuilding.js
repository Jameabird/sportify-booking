require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const Building = require("./models/buildings.js");
const Place = require("./models/Place");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// ✅ เชื่อมต่อ MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "SE",
  })
  .then(() => console.log("✅ MongoDB Connected to SE"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

  const BookingHistory = mongoose.model("history", new mongoose.Schema({
    name: String,
    type: String,
    coupons: String,  
    user: { _id: mongoose.Schema.Types.ObjectId },
  }, { strict: false }), "history");
  
  const Promotion = mongoose.model("promotions", new mongoose.Schema({
    name: String,
    description: String,
    status: String,
    sale: Number,
    free: String,
  }, { strict: false }), "promotions");
  

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

// ✅ API ดึงคูปองที่ออนไลน์อยู่ทั้งหมด (ใช้ authenticate)
app.get("/api/promotions", authenticate, async (req, res) => {
  try {
    const promotions = await Promotion.find({ status: "online" });
    const usersHistory = await BookingHistory.find({
      "user._id": new mongoose.Types.ObjectId(req.user.userId),
      coupons: "false",
    });

    const couponCounts = usersHistory.reduce((acc, item) => {
      acc[item.type.trim()] = (acc[item.type.trim()] || 0) + 1;
      return acc;
    }, {});

    const finalCoupons = promotions.map((promo) => {
      let canUse = Object.keys(couponCounts).some(type => couponCounts[type] === promo.sale);
      return {
        ...promo._doc,
        canUse,
        startdate: promo.startdate ? new Date(promo.startdate).toLocaleDateString("th-TH") : "ไม่ระบุ",
        enddate: promo.enddate ? new Date(promo.enddate).toLocaleDateString("th-TH") : "ไม่ระบุ",
      };
    });

    res.json(finalCoupons);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving promotions", error: error.message });
  }
});

/** ================================
 * ✅ เปิดเซิร์ฟเวอร์
 * ================================ */
const PORT = process.env.PORT5 || 5005;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
