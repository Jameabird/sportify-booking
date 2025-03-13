require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const Building = require("./models/buildings.js");
const Place = require("./models/Place");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use(express.json({ limit: "10mb" })); // Increase limit to 10MB
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Increase limit

const storage = multer.memoryStorage(); // Store image in memory before processing
const upload = multer({ storage });
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
app.post("/api/buildings", upload.single("image"), async (req, res) => {
  try {
    console.log("🔹 Request received:", req.body);

    const { userid, username, name, location, link, details, image } = req.body;

    if (!name || !location || !link || !image) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    // ✅ Compress and save image as a file instead of Base64
    let processedImage = image; // Use `let` to allow reassignment
    
        if (image) {
          const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, "base64");
    
          const compressedImageBuffer = await sharp(buffer)
            .resize({ width: 800 }) 
            .jpeg({ quality: 85 }) 
            .toBuffer();
    
          processedImage = `data:image/jpeg;base64,${compressedImageBuffer.toString("base64")}`;
        }

    // ✅ Store only the file path, not Base64!
    const newBuilding = new Building({
      userid,
      username,
      name,
      location,
      link,
      details,
      image: processedImage,
    });

    await newBuilding.save();
    console.log("🔹 Request sent:", newBuilding);
    res.status(201).json({ message: "เพิ่มข้อมูลสำเร็จ", building: newBuilding });

  } catch (err) {
    console.error("🚨 Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================== API ดึงคูปอง ============================ //
app.get("/api/promotions", authenticate, async (req, res) => {
  try {
    console.log("🔹 Fetching promotions for userId:", req.user.userId);

    const promotions = await Promotion.find({ status: "online" });

    const usersHistory = await BookingHistory.find({
      "user._id": new mongoose.Types.ObjectId(req.user.userId),
      coupons: "false",
      status: "reserve",
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

    res.json({ promotions: finalCoupons, couponCounts }); // ✅ ส่ง couponCounts ออกไปด้วย
  } catch (error) {
    console.error("🚨 Error retrieving promotions:", error.message);
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
