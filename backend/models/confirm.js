const mongoose = require("mongoose");

const ConfirmSchema = new mongoose.Schema({
  name: String,
  day: String,
  timepaid: String,
  status: String,
  image: String,
  price: Number,
  location: String,
  total_price: Number,  // ✅ เพิ่ม total_price
});

const Confirm = mongoose.model("Confirm", ConfirmSchema);
module.exports = Confirm;

