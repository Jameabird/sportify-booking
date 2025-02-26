require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  dbName: "SE",
}).then(() => console.log("✅ MongoDB Connected to SE"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

mongoose.connection.once("open", async () => {
  console.log("🔗 Connected to Database:", mongoose.connection.name);
  
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("🔗 Available Collections:", collections.map(c => c.name));
});

// Booking History Schema
const bookingSchema = new mongoose.Schema({
  name: String,
  image: String,
  day: String,
  time: String,
  location: String,
  status: String,
  price: String,
  type: String,
  role: String,
  user: {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    email: String,
    role: String,
  },
  owner: {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    email: String,
    role: String,
  },
},
{ strict: false });

const BookingHistory = mongoose.model("BookingHistory", bookingSchema, "history");

// Middleware สำหรับตรวจสอบ JWT
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

// API ดึงประวัติการจองของผู้ใช้
// API ดึงประวัติการจองของผู้ใช้และ owner
app.get("/api/history", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("🔹 Fetching history for userId:", userId, "Role:", req.user.role);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    let history;
    if (req.user.role === "admin") {
      history = await BookingHistory.find({});
    } else if (req.user.role === "owner") {
      history = await BookingHistory.find({ "owner._id": objectId });
    } else {
      history = await BookingHistory.find({ "user._id": objectId });
    }

    console.log("✅ Retrieved history:", history);
    res.json(history);
  } catch (error) {
    console.error("🚨 Error retrieving booking history:", error.message);
    res.status(500).json({ message: "Error retrieving booking history", error: error.message });
  }
});


const PORT = process.env.PORT1 || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
