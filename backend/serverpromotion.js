const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Promotion = require("./models/Promotion.js");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "SE"  
})
.then(() => console.log("MongoDB Connected to SE"))
.catch(err => console.error(err));




app.get("/api/promotions", async (req, res) => {
  try {
    const promotions = await Promotion.find();

    const updatedPromotions = promotions.map((promo) => {
      const today = new Date();
      const endDate = promo.enddate ? new Date(promo.enddate) : null;

      let status;
      if (!endDate) {
        status = "online"; 
      } else if (today.toDateString() === endDate.toDateString()) {
        status = "online"; 
      } else {
        status = today > endDate ? "offline" : "online"; 
      }

      return { ...promo.toObject(), status };
    });

    res.json(updatedPromotions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
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

  app.put("/api/promotions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!req.body) {
        return res.status(400).json({ message: "ไม่มีข้อมูลสำหรับอัปเดต" });
      }
  
      const updatedPromotion = await Promotion.findByIdAndUpdate(id, req.body, { new: true });
  
      if (!updatedPromotion) {
        return res.status(404).json({ message: "ไม่พบโปรโมชั่นที่ต้องการอัปเดต" });
      }
  
      res.status(200).json(updatedPromotion);
    } catch (err) {
      console.error("Error updating promotion:", err);
      res.status(500).json({ error: err.message });
    }
  });
  

  app.delete("/api/promotions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await Promotion.findByIdAndDelete(id);
      res.status(200).json({ message: "ลบโปรโมชั่นสำเร็จ" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  

const PORT = process.env.PORT1 || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
