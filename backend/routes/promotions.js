const express = require("express");
const Promotion = require("../models/Promotion");

const router = express.Router();

// ✅ ดึงข้อมูลโปรโมชั่นทั้งหมด
router.get("/", async (req, res) => {
    try {
        const promotions = await Promotion.find();
        res.json(promotions);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ เพิ่มโปรโมชั่นใหม่
router.post("/", async (req, res) => {
    try {
        const newPromotion = new Promotion(req.body);
        await newPromotion.save();
        res.status(201).json(newPromotion);
    } catch (error) {
        res.status(400).json({ message: "Error creating promotion", error });
    }
});

// ✅ อัปเดตโปรโมชั่น
router.put("/:id", async (req, res) => {
    try {
        const updatedPromotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPromotion);
    } catch (error) {
        res.status(400).json({ message: "Error updating promotion", error });
    }
});

// ✅ ลบโปรโมชั่น
router.delete("/:id", async (req, res) => {
    try {
        await Promotion.findByIdAndDelete(req.params.id);
        res.json({ message: "Promotion deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting promotion", error });
    }
});

module.exports = router;
