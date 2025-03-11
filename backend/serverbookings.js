const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const sharp = require("sharp");
const Refund = require("./models/refund.js");
const Bookings = require("./models/Bookings.js");
const Users = require("./models/user.js"); 

dotenv.config();
const app = express();

// ✅ Increase payload size limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "SE",
  })
  .then(() => console.log("✅ MongoDB Connected to SE"))
  .catch((err) => console.error(err));

// ✅ Get all bookings (old route)
app.get("/api/bookings-old", async (req, res) => {
  try {
    const bookings = await Bookings.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get bookings for a specific user
app.get("/api/bookings", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const bookings = await Bookings.find({ userId });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get refunds for a user (with accountNumber)
app.get("/api/refund", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const refunds = await Refund.find({ userId, status: "cancel" }).populate("userId", "accountNumber");

    const result = refunds.map(refund => ({
      ...refund.toObject(),
      accountNumber: refund.userId?.accountNumber || "N/A",
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create new booking (with image compression)
app.post("/api/bookings", async (req, res) => {
  console.log(req.body);
  try {
    let {
      name,
      day,
      time,
      location,
      field,
      status,
      price,
      type,
      building,
      role,
      user,
      datepaid,
      timepaid,
      image,
    } = req.body;

    if (!name || !day || !time || !location || !field || !type || !building) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    // ✅ Compress image if provided
    if (image) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, ""); // Remove metadata
      const buffer = Buffer.from(base64Data, "base64"); // Convert to buffer

      const compressedImageBuffer = await sharp(buffer)
        .resize({ width: 700 }) // Resize max width 500px
        .jpeg({ quality: 80 }) // Convert to JPEG with 70% quality
        .toBuffer();

      image = `data:image/jpeg;base64,${compressedImageBuffer.toString("base64")}`;
    }

    const newBooking = new Bookings({
      name,
      day,
      time,
      location,
      field,
      status: status || "reserved",
      price,
      type,
      building,
      role,
      user,
      datepaid,
      timepaid: timepaid || "",
      image, // ✅ Compressed image saved
    });

    await newBooking.save();
    res.status(201).json({ message: "เพิ่มการจองสำเร็จ", booking: newBooking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update booking by ID
app.put("/api/bookings/:id", async (req, res) => {
  try {
    console.log("📌 datepaid:", req.body.datepaid);
    console.log("📌 status:", req.body.status);

    const { id } = req.params;
    if (!req.body) {
      return res.status(400).json({ message: "ไม่มีข้อมูลสำหรับอัปเดต" });
    }

    const updatedBooking = await Bookings.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedBooking) {
      return res.status(404).json({ message: "ไม่พบการจองที่ต้องการอัปเดต" });
    }
    res.status(200).json(updatedBooking);
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete booking by ID
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Bookings.findByIdAndDelete(id);
    res.status(200).json({ message: "ลบการจองสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create refund request
app.post("/api/refund", async (req, res) => {
  try {
    const { name, day, time, status, price, datepaid, timepaid, userId } = req.body;

    if (!name || !day || !time || !status || !price || !timepaid) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const newRefund = new Refund({
      name,
      day,
      time,
      status,
      price,
      datepaid,
      timepaid,
      userId,
    });

    await newRefund.save();
    res.status(201).json({ message: "สร้างการคืนเงินสำเร็จ", refund: newRefund });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start server
const PORT = process.env.PORT2 || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
