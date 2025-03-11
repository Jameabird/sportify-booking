const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Bookings = require("./models/Bookings.js"); // Use correct model name
const Confirm = require("./models/confirm.js");
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

  app.get("/api/confirm", async (req, res) => {
    try {
      const confirm = await Confirm.find({}, "date item amount officer status"); // ดึงเฉพาะฟิลด์ที่ต้องการ
      res.json(confirm);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

  app.post("/api/confirm", async (req, res) => {
    try {
      console.log("📌 Data received:", req.body);  // ดูข้อมูลที่ส่งมา
  
      const newConfirms = await Confirm.insertMany(req.body);
      console.log("New Confirms Created:", newConfirms);
  
      // ตรวจสอบการตอบกลับจาก MongoDB
      if (newConfirms && newConfirms.length > 0) {
        res.status(201).json({ message: "Confirmed bookings saved successfully!", data: newConfirms });
      } else {
        res.status(400).json({ error: "No data was saved to the database." });
      }
    } catch (err) {
      console.error("Error confirming booking:", err);
      res.status(500).json({ error: err.message });
    }
  });
 
// UPDATE booking by ID
app.put("/api/bookings/:id", async (req, res) => {
  try {
    console.log("📌 datepaid ที่ได้รับจาก client:", req.body.datepaid);
    const { id } = req.params;
    if (!req.body) {
      return res.status(400).json({ message: "ไม่มีข้อมูลสำหรับอัปเดต" });
    }

    const updatedBooking = await Bookings.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedBooking) {
      return res.status(404).json({ message: "ไม่พบการจองที่ต้องการอัปเดต" });
    }

    res.status(200).json(updatedBooking);
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE booking by ID
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Bookings.findByIdAndDelete(id);
    res.status(200).json({ message: "ลบการจองสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



const PORT = process.env.PORT2 || 5003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
