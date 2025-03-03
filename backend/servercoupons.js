require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGO_URI, {
  dbName: "SE",
}).then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 🔹 Middleware ตรวจสอบ JWT
const authenticate = (req, res, next) => {
  let token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Authentication required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// 🔹 สร้าง Schema และ Model
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

// ✅ API ดึงคูปองที่ออนไลน์อยู่ทั้งหมด (บอกว่าคูปองไหนใช้ได้บ้าง)
app.get("/api/promotions", authenticate, async (req, res) => {
  try {
    console.log("🔹 Fetching promotions for userId:", req.user.userId);

    const promotions = await Promotion.find({ status: "online" });

    const usersHistory = await BookingHistory.find({
      "user._id": new mongoose.Types.ObjectId(req.user.userId),
      coupons: "false",
    });

    const couponCounts = usersHistory.reduce((acc, item) => {
      const normalizedType = item.type.trim();
      acc[normalizedType] = (acc[normalizedType] || 0) + 1;
      return acc;
    }, {});

    const finalCoupons = promotions.map((promo) => {
      const required = promo.sale;
      let canUse = false;

      Object.keys(couponCounts).forEach((type) => {
        if (couponCounts[type] === required) {
          canUse = true;
        }
      });

      return { 
        ...promo._doc, 
        canUse,
        startdate: promo.startdate ? new Date(promo.startdate).toLocaleDateString("th-TH") : "ไม่ระบุ",
        enddate: promo.enddate ? new Date(promo.enddate).toLocaleDateString("th-TH") : "ไม่ระบุ",
      };
    });

    res.json(finalCoupons);
  } catch (error) {
    console.error("🚨 Error retrieving promotions:", error.message);
    res.status(500).json({ message: "Error retrieving promotions", error: error.message });
  }
});


// ✅ รันเซิร์ฟเวอร์
const PORT = process.env.PORT1 || 4002;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
