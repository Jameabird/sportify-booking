const mongoose = require("mongoose");

const RefundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  day: { type: String, required: true },
  time: { type: String, required: true},
  status: { type: String, required: true },
  price: { type: String, required: true },
  datepaid: { type: Date, default: Date.now },
  timepaid: { type: String, required: true }
});

module.exports = mongoose.models.refund || mongoose.model("refund", RefundSchema);
