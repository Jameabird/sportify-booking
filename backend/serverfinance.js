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

  router.post("/api/finance", async (req, res) => {
    try {
      const financeEntries = await Finance.insertMany(req.body);
      res.status(201).json(financeEntries);
    } catch (error) {
      console.error("🚨 Error saving finance data:", error);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
    }
  });
  

const PORT = process.env.PORT3 || 5008;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
