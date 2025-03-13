const mongoose = require("mongoose");

const financeSchema = new mongoose.Schema({
  _id: { type: String, required: true },  // ✅ เปลี่ยนจาก ObjectId เป็น String
  date: { type: Date, required: true },
  location: { type: String, required: true },
  totalRevenue: { type: Number, required: true },
  refund: { type: Number, required: true, default: 0 },
  deduction5Percent: { type: Number, required: true },
  payout: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Finance", financeSchema);
