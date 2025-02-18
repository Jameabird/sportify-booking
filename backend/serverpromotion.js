require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const promotionRoutes = require("./routes/promotions");

// เชื่อมต่อ MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// ใช้ API Routes
app.use("/api/promotions", promotionRoutes);

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
