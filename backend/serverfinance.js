const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Finance = require("./models/finance.js");  // ตรวจสอบให้แน่ใจว่า Model มีไฟล์นี้จริง ๆ

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
  .then(() => console.log("MongoDB Connected to SE"))
  .catch((err) => console.error(err));

// POST บันทึกข้อมูล
app.post("/api/finance", async (req, res) => {
  try {
    const financeEntries = await Finance.insertMany(req.body);
    res.status(201).json(financeEntries);
  } catch (error) {
    console.error("🚨 Error saving finance data:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
  }
});

// ✅ เปลี่ยนจาก router.get เป็น app.get
app.get("/api/finance", async (req, res) => {
  try {
    const financeData = await Finance.find();  // ดึงข้อมูลทั้งหมดจาก Finance
    res.status(200).json(financeData);
  } catch (error) {
    console.error("🚨 Error retrieving finance data:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

const PORT = process.env.PORT || 5008;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
