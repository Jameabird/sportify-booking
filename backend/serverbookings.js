const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ✅ Increase payload size limit (to 10MB)
app.use(express.json({ limit: "50mb" })); // Increase limit to 50MB
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "SE",
  })
  .then(() => console.log("MongoDB Connected to SE"))
  .catch((err) => console.error(err));

const Bookings = require("./models/Bookings.js");
// GET bookings
app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Bookings.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/bookings", async (req, res) => {
    try {
      console.log("Received Data:", req.body); // ✅ Debug log
  
      const { name, day, time, location, status, price, type, building, role, user, image } = req.body;
  
      if (!name || !day || !time || !location || !type || !building) {
        return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
      }
  
      const newBooking = new Bookings({
        name,
        day,
        time,
        location,
        status: status || "reserved",
        price,
        type,
        building,
        role,
        user,
        image, // ✅ Make sure image is passed
      });
  
      await newBooking.save();
      res.status(201).json({ message: "เพิ่มการจองสำเร็จ", booking: newBooking });
    } catch (err) {
      console.error("❌ Server Error:", err); // ✅ Log detailed error
      res.status(500).json({ error: err.message });
    }
  });
  
// UPDATE booking by ID
// UPDATE booking by ID (รวม image)
app.put("/api/bookings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { image, ...updateData } = req.body; // ✅ แยก image ออกมา
  
      if (!updateData) {
        return res.status(400).json({ message: "ไม่มีข้อมูลสำหรับอัปเดต" });
      }
  
      const updatedBooking = await Bookings.findByIdAndUpdate(
        id,
        { ...updateData, image }, // ✅ อัปเดตข้อมูลรวมถึง image
        { new: true }
      );
  
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

const PORT = process.env.PORT2 || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
