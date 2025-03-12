const { image } = require("@nextui-org/react");
const mongoose = require("mongoose");

const BookingsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  day: { type: String, required: true },
  time: { type: String, required: true},
  location: { type: String, required: true },
  field: { type: String, required: true },
  status: { type: String, required: true },
  price: { type: String, required: true },
  type: { type: String, required: true },
  building: { type: String, required: true },
  role: { type: String, required: true },
  datepaid: { type: Date, default: Date.now },
  timepaid: { type: String, required: true },
  image: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  accountNumber: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, // เชื่อมกับ Users
});

module.exports = mongoose.models.Bookings || mongoose.model("Bookings", BookingsSchema);
