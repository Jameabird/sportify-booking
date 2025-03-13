const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Bookings = require("./models/Bookings.js"); // Use correct model name
const Confirm = require("./models/confirm.js");
const Finance = require("./models/finance.js");  // ✅ ชื่อ Model ต้องตรงกับที่ใช้ใน Mongoose


dotenv.config();
const app = express();
app.use(express.json());  // ต้องมีคำสั่งนี้
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "SE",
  })
  .then(() => console.log("MongoDB Connected to SE"))
  .catch((err) => console.error(err));

  app.post("/api/finance", async (req, res) => {
    try {
      console.log("📩 Received Data:", req.body); // ✅ Debug Data ที่รับมา
  
      const financeData = req.body;
      if (!Array.isArray(financeData) || financeData.length === 0) {
        return res.status(400).json({ message: "❌ ไม่มีข้อมูลสำหรับบันทึก" });
      }
  
      const newFinanceRecords = await Finance.insertMany(financeData);
      console.log("✅ Data saved:", newFinanceRecords);  // ✅ Debug ข้อมูลที่บันทึกลง DB
  
      res.status(201).json({ message: "✅ Data saved successfully!", data: newFinanceRecords });
    } catch (error) {
      console.error("🚨 Server Error:", error);  // ❌ ดู Error ที่เกิดขึ้น
      res.status(500).json({ message: "❌ Server Error", error });
    }
  });
  

  

const PORT = process.env.PORT3 || 5008;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
