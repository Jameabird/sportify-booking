const mongoose = require("mongoose");

const RefundSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    day: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true },
    price: { type: Number, required: true }, // เปลี่ยนเป็น Number
    datepaid: { type: Date, default: Date.now },
    timepaid: { type: String, required: true, trim: true },
    accountNumber: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // เชื่อมกับ User
  },
  { timestamps: true } // เพิ่ม timestamps
);

module.exports = mongoose.models.Refund || mongoose.model("Refund", RefundSchema);
