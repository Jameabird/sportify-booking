const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Bookings = require("./models/Bookings.js"); // Use correct model name
const Confirm = require("./models/confirm.js");
const Refund = require("./models/refund.js");
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

  app.get("/api/refund", async (req, res) => {
    try {
      const refund = await Refund.find();
      res.json(refund);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/refund", async (req, res) => {
    try {
      console.log("📌 Data received:", req.body);
  
      if (!Array.isArray(req.body)) {
        return res.status(400).json({ error: "Invalid data format. Expected an array." });
      }
  
      const newRefund = await Refund.insertMany(req.body); // รองรับการบันทึกหลายรายการ
  
      console.log("New Confirms Created:", newRefund);
      res.status(201).json({ message: "Confirmed bookings saved successfully!", data: newRefund });
    } catch (err) {
      console.error("Error confirming booking:", err);
      res.status(500).json({ error: err.message });
    }
  });
  



const PORT = process.env.PORT2 || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
