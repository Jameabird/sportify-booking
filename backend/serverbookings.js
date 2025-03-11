const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Refund = require("./models/refund.js");

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
const authenticate = (req, res, next) => {
  let token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token && req.body.token) {
    token = req.body.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    console.log("🔹 Received Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔹 Decoded JWT:", decoded);

    if (!decoded.userId) {
      throw new Error("Invalid token payload: Missing userId");
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("🚨 JWT Authentication Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired, please log in again" });
    }

    return res.status(401).json({ message: "Invalid token", error: error.message });
  }
};
app.post("/api/refund", async (req, res) => {
  try {
    const { name, day, time, status, price, datepaid, timepaid, userId } = req.body;

    // ตรวจสอบว่าข้อมูลครบถ้วนหรือไม่
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


const Users = require("./models/user.js"); // ตรวจสอบให้แน่ใจว่ามีโมเดล Users

app.get("/api/bookings", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const bookings = await Booking.find({ userId }); // ดึงข้อมูลเฉพาะของ userId
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.get("/api/refund", async (req, res) => {
  try {
    const { userId } = req.query; // รับ userId จาก request

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // ดึงเฉพาะรายการคืนเงินของผู้ใช้ที่มี status "cancel"
    const refunds = await Refund.find({ userId, status: "cancel" }).populate("userId", "accountNumber");

    const result = refunds.map(refund => ({
      ...refund.toObject(),
      accountNumber: refund.userId?.accountNumber || "N/A", // ถ้าไม่มี accountNumber ให้ใช้ "N/A"
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const {
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

    if (!userId || !role) {
      return res.status(400).json({ message: "User ID and role are required" });
    }

    const newBooking = new Booking({
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
      userId, // Store user ID
      datepaid,
      timepaid: timepaid || "",
      image,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking successful", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


// UPDATE booking by ID
// UPDATE booking by ID (รวม image)
app.put("/api/bookings/:id", async (req, res) => {
  try {
    console.log("📌 datepaid ที่ได้รับจาก client:", req.body.datepaid);
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
