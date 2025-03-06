const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const User = require("./models/user.js");
const Refund = require("./models/refund.js");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// เชื่อมต่อ MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "SE",
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Database Connection Error:", err));

/** 📌 GET: ดึงข้อมูล Refund พร้อม accountNumber **/
app.get("/api/refund", async (req, res) => {
  try {
    const refunds = await Refund.find().populate("userId", "accountNumber name email"); // ดึงข้อมูลจาก User

    const formattedRefunds = refunds.map((refund) => ({
      ...refund.toObject(),
      accountNumber: refund.userId?.accountNumber || "N/A",
      userName: refund.userId?.name || "Unknown",
      userEmail: refund.userId?.email || "Unknown",
    }));

    res.json(formattedRefunds);
  } catch (err) {
    console.error("❌ Error fetching refunds:", err);
    res.status(500).json({ error: err.message });
  }
});

/** 📌 POST: บันทึกข้อมูล Refund และเชื่อมกับ User **/
app.post("/api/refund", async (req, res) => {
  try {
    console.log("📌 Data received:", req.body);

    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: "Invalid data format. Expected an array." });
    }

    // ตรวจสอบว่า userId มีอยู่ในฐานข้อมูลหรือไม่
    for (const refund of req.body) {
      const user = await User.findById(refund.userId);
      if (!user) {
        return res.status(404).json({ error: `User with ID ${refund.userId} not found.` });
      }
    }

    const newRefunds = await Refund.insertMany(req.body);
    console.log("✅ Refunds Created:", newRefunds);

    res.status(201).json({ message: "Refunds saved successfully!", data: newRefunds });
  } catch (err) {
    console.error("❌ Error saving refunds:", err);
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT2 || 5005;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
