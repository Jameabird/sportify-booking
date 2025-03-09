const mongoose = require("mongoose");

const ConfirmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  day: { type: String, required: true },
  timepaid: { type: String, default: "" }, // ป้องกัน error ถ้าไม่มีค่า
  status: { type: String, default: "Confirmed" },
  price: { type: Number, required: true },
});


module.exports = mongoose.model("Confirm", ConfirmSchema);
