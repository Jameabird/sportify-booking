const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Promotion = require("./models/promotion.js");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// 📌 ดึงข้อมูลโปรโมชั่นทั้งหมด
app.get("/api/promotions", async (req, res) => {
    try {
      const promotions = await Promotion.find();
      res.json(promotions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // 📌 เพิ่มโปรโมชั่นใหม่
  app.post("/api/promotions", async (req, res) => {
    try {
      const { name, description, status, startdate, enddate, sale, free } = req.body;
  
      if (!name || !description || !startdate || sale === undefined || free === undefined) {
        return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
      }
  
      const newPromotion = new Promotion({
        name,
        description,
        status: status || "online",
        startdate,
        enddate: enddate === "null" ? null : enddate,
        sale,
        free,
      });
  
      await newPromotion.save();
      res.status(201).json({ message: "เพิ่มโปรโมชั่นสำเร็จ", promotion: newPromotion });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
