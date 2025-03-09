const mongoose = require("mongoose");

const RefundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  day: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, required: true },
  price: { type: String, required: true },
  datepaid: { type: Date, default: Date.now },
  timepaid: { type: String, required: true },
  accountNumber: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // เชื่อมกับ User
});

module.exports = mongoose.models.Refund || mongoose.model("Refund", RefundSchema);
