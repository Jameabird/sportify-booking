const mongoose = require("mongoose");

const financeSchema = new mongoose.Schema({
  date: { type: Date, required: true }, // วัน
  location: { type: String, required: true }, // สถานที่
  totalRevenue: { type: Number, required: true }, // รายได้รวม
  refund: { type: Number, required: true, default: 0 }, // คืนเงิน
  deduction5Percent: { type: Number, required: true }, // หัก 5%
  payout: { type: Number, required: true } // เงินออก
}, { timestamps: true }); // เพิ่ม createdAt และ updatedAt อัตโนมัติ

module.exports = mongoose.model("Finance", financeSchema);
