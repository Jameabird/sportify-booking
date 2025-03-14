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
 * ✅ GET: ดึงข้อมูลสนามทั้งหมด (ไม่ใช้ userid)
 * ================================ */
app.get("/api/building-user", async (req, res) => {
  try {
    console.log("📌 Fetching all buildings...");

    const buildings = await Building.find(); // ✅ Fetch all buildings

    if (!buildings || buildings.length === 0) {
      return res.status(404).json({ message: "❌ No buildings found" });
    }

    res.json(buildings.map((building) => building.toJSON()));
  } catch (err) {
    console.error("❌ Error fetching buildings:", err);
    res.status(500).json({ error: err.message });
  }
});


/** ================================
 * ✅ GET: ดึงข้อมูลสนามทั้งหมด
 * ================================ */
app.get("/api/buildings", async (req, res) => {
  try {
    const { userid } = req.query;

    if (!userid) {
      console.log("❌ Missing user ID in request");
      return res.status(400).json({ message: "User ID is required" });
    }

    console.log("📌 Searching for buildings with userid:", userid);

    const buildings = await Building.find({ userid }); // ✅ Correct query

    if (!buildings || buildings.length === 0) {
      return res.status(404).json({ message: "No buildings found for this user" });
    }

    res.json(buildings.map((building) => building.toJSON()));
  } catch (err) {
    console.error("❌ Error fetching buildings:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/buildings-officer", async (req, res) => {
  try {
    const { useridofficer } = req.query;

    if (!useridofficer) {
      console.log("❌ Missing user ID in request");
      return res.status(400).json({ message: "User ID is required" });
    }

    console.log("📌 Searching for buildings with userid:", useridofficer);

    const buildings = await Building.find({ useridofficer }); // ✅ Correct query

    if (!buildings || buildings.length === 0) {
      return res.status(404).json({ message: "No buildings found for this user" });
    }

    res.json(buildings.map((building) => building.toJSON()));
  } catch (err) {
    console.error("❌ Error fetching buildings:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/update-buildings", async (req, res) => {
  try {
    console.log("🔹 Update Request Received:", JSON.stringify(req.body, null, 2));

    const { Name, Type, Building } = req.body;

    if (!Name || !Type || !Building || Object.keys(Building).length === 0) {
      return res.status(400).json({ message: "❌ Missing required fields!" });
    }

    const buildingName = Object.keys(Building)[0]; // Get first building key
    const fieldKey = Object.keys(Building[buildingName])[0]; // Get first field key
    const newBookingStatus = Building[buildingName][fieldKey].Booking;

    if (buildingName === undefined || fieldKey === undefined || newBookingStatus === undefined) {
      return res.status(400).json({ message: "❌ Invalid data structure!" });
    }

    console.log("📌 Updating:", { Name, Type, buildingName, fieldKey, newBookingStatus });

    const updatedBuilding = await BuildingModel.findOneAndUpdate(
      { name: Name, Type: Type },
      { $set: { [`Building.${buildingName}.${fieldKey}.Booking`]: newBookingStatus } },
      { new: true, runValidators: true }
    );

    if (!updatedBuilding) {
      return res.status(404).json({ message: "❌ Building not found!" });
    }

    console.log("✅ Updated Building:", updatedBuilding);
    res.status(200).json({ message: "✅ Booking updated successfully!", updatedBuilding });

  } catch (err) {
    console.error("🚨 Error updating building:", err);
    res.status(500).json({ error: err.message });
  }
});




/** ================================
 * ✅ POST: เพิ่มอาคารใหม่
 * ================================ */
app.post("/api/buildings", upload.single("image"), async (req, res) => {
  try {
    console.log("🔹 Request received:", req.body);

    const { userid, username, name, location, link, details, image, Type } = req.body;
    let { buildingData } = req.body; 

    if (!name || !location || !link || !image || !Type) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    // ✅ Debugging: Ensure `buildingData` exists
    console.log("✅ Raw buildingData:", buildingData);
    if (typeof buildingData === "string") {
      try {
        buildingData = JSON.parse(buildingData);
        console.log("✅ Parsed buildingData:", buildingData);
      } catch (error) {
        console.error("❌ Error parsing buildingData:", error);
        return res.status(400).json({ message: "Invalid buildingData format" });
      }
    } else {
      console.log("✅ Direct buildingData:", buildingData);
    }

    // ✅ Compress Image
    let processedImage = image;
    if (image) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const compressedImageBuffer = await sharp(buffer)
        .resize({ width: 800 })
        .jpeg({ quality: 85 })
        .toBuffer();

      processedImage = `data:image/jpeg;base64,${compressedImageBuffer.toString("base64")}`;
    }

    // ✅ Save to MongoDB
    const newBuilding = new Building({
      Type,
      userid,
      username,
      name,
      location,
      link,
      details,
      image: processedImage,
      Building: buildingData || {}, // ✅ Ensure it's always an object
    });

    await newBuilding.save();
    console.log("✅ Successfully saved:", JSON.stringify(newBuilding, null, 2));
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
 * ✅ DELETE: ลบอาคารโดยใช้ ID
 * ================================ */
app.delete("/api/buildings/:id", async (req, res) => {
  try {
    const buildingId = req.params.id;
    console.log(`🗑️ Deleting building with ID: ${buildingId}`);

    // ค้นหาและลบอาคาร
    const deletedBuilding = await Building.findByIdAndDelete(buildingId);

    if (!deletedBuilding) {
      return res.status(404).json({ message: "❌ Building not found" });
    }

    res.status(200).json({ message: "✅ Building deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting building:", error);
    res.status(500).json({ message: "❌ Server error while deleting building" });
  }
});

app.delete("/api/buildings/:buildingId/fields/:fieldId", async (req, res) => {
  try {
    let { buildingId, fieldId } = req.params;
    console.log(`🗑️ Deleting field "${fieldId}" from building ID: ${buildingId}`);

    // Ensure buildingId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(buildingId)) {
      return res.status(400).json({ message: "❌ Invalid building ID format" });
    }

    // Find the building
    const building = await Building.findById(buildingId);
    if (!building) {
      return res.status(404).json({ message: "❌ Building not found" });
    }

    // Check if the field exists in the building
    if (!building.Building || !building.Building[fieldId]) {
      return res.status(404).json({ message: "❌ Field not found in this building" });
    }

    // Remove the field from the Building object
    delete building.Building[fieldId];

    // Save the updated building document
    await building.save();

    res.status(200).json({ message: "✅ Field deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting field:", error);
    res.status(500).json({ message: "❌ Server error while deleting field" });
  }
});


/** ================================
 * ✅ เปิดเซิร์ฟเวอร์
 * ================================ */
const PORT = process.env.PORT5 || 5005;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
