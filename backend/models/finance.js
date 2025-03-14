const mongoose = require("mongoose");

const financeSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  totalRevenue: { type: Number, required: true },
  refund: { type: Number, required: true, default: 0 },
  deduction5Percent: { type: Number, required: true },
  payout: { type: Number, required: true },
  ownerInfo: { // ✅ เพิ่ม ownerInfo
    firstName: { type: String },
    bank: { type: String },
    accountNumber: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model("Finance", financeSchema);
