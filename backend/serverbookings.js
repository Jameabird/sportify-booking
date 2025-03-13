const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const sharp = require("sharp");
const Refund = require("./models/refund.js");
const Users = require("./models/user.js");
const Bookings = require("./models/Bookings.js");

dotenv.config();
const app = express();

// ✅ Increase payload size limit (to 10MB)
app.use(express.json({ limit: "5mb" })); 
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "SE",
  })
  .then(() => console.log("✅ MongoDB Connected to SE"))
  .catch((err) => console.error("🚨 MongoDB Connection Error:", err));

/**
 * 📌 Get all bookings or filter by userId (if provided)
 */
app.get("/api/bookings", async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {}; // If userId exists, filter by it
    const bookings = await Bookings.find(query);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * 📌 Create a new booking
 */
app.post("/api/bookings", async (req, res) => {
  try {
    console.log("📩 Incoming booking request:", req.body);

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
      userId,
      datepaid,
      timepaid,
      image,
    } = req.body;

    if (!userId || !role) {  
      console.warn("⚠️ Missing user ID or role:", { userId, role });
      return res.status(400).json({ message: "User ID and role are required" });
    }

    let processedImage = image; // Use `let` to allow reassignment

    if (image) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const compressedImageBuffer = await sharp(buffer)
        .resize({ width: 800 }) 
        .jpeg({ quality: 85 }) 
        .toBuffer();

      processedImage = `data:image/jpeg;base64,${compressedImageBuffer.toString("base64")}`;
    }

    const newBooking = new Bookings({
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
      userId,
      datepaid,
      timepaid: timepaid || "",
      image: processedImage,
    });

    await newBooking.save();
    console.log("✅ Booking successfully created:", newBooking);
    res.status(201).json({ message: "Booking successful", booking: newBooking });

  } catch (error) {
    console.error("🚨 Error creating booking:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * 📌 Update a booking by ID
 */
app.put("/api/bookings/:id", async (req, res) => {
  try {
    console.log("📌 Updating booking with data:", req.body);
    const { id } = req.params;

    const updatedBooking = await Bookings.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(updatedBooking);
  } catch (err) {
    console.error("🚨 Error updating booking:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 📌 Delete a booking by ID
 */
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Bookings.findByIdAndDelete(id);
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("🚨 Error deleting booking:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 📌 Create a refund request
 */
app.post("/api/refund", async (req, res) => {
  try {
    const { name, day, time, status, price, datepaid, timepaid, userId } = req.body;

    if (!name || !day || !time || !status || !price || !timepaid) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRefund = new Refund({
      name,
      day,
      time,
      type,
      status,
      price,
      datepaid,
      timepaid,
      userId,
    });

    await newRefund.save();
    res.status(201).json({ message: "Refund request created", refund: newRefund });
  } catch (err) {
    console.error("🚨 Error processing refund:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 📌 Get refunds for a user (filtered by 'cancel' status)
 */
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
    console.error("🚨 Error fetching refunds:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start the server
const PORT = process.env.PORT2 || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
