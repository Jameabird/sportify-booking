const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Finance = require("./models/finance.js");

dotenv.config();
const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    
    dbName: "SE",
  })
  .then(() => console.log("✅ MongoDB Connected to SE"))
  .catch((err) => console.error("🚨 MongoDB Connection Error:", err));

// ✅ GET: ดึงข้อมูลทั้งหมดจาก Finance
app.get("/api/finance", async (req, res) => {
  try {
    const finances = await Finance.find().sort({ date: -1 }); // เรียงจากวันที่ล่าสุดไปเก่าสุด
    res.status(200).json(finances);
  } catch (error) {
    res.status(500).json({ message: "❌ Server Error", error });
  }
});

// ✅ GET: ดึงข้อมูลตาม ID
app.get("/api/finance/:id", async (req, res) => {
  try {
    const finance = await Finance.findById(req.params.id);
    if (!finance) {
      return res.status(404).json({ message: "❌ Data not found" });
    }
    res.status(200).json(finance);
  } catch (error) {
    res.status(500).json({ message: "❌ Server Error", error });
  }
});
app.post("/api/finance", async (req, res) => {
    try {
      console.log(req.body); // Log ข้อมูลที่ได้รับ
      const { date, location, totalRevenue, refund, deduction5Percent, payout } = req.body;
  
      const newFinance = new Finance({
        date,
        location,
        totalRevenue,
        refund,
        deduction5Percent,
        payout,
      });
  
      await newFinance.save();
      res.status(201).json({ message: "✅ Data saved successfully!", data: newFinance });
    } catch (error) {
      res.status(500).json({ message: "❌ Server Error", error });
    }
  });

const PORT = process.env.PORT || 5008;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

