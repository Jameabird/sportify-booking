const mongoose = require("mongoose");

const ConfirmSchema = new mongoose.Schema({
  name: String,
  day: String,
  timepaid: String,
  status: String,
  image: String,
  price: Number,
  location: String,  // เพิ่ม location
});

const Confirm = mongoose.model("Confirm", ConfirmSchema);
module.exports = Confirm;
