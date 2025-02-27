const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["user", "admin", "owner"], required: true },
  location: { type: String, required: true },
  day: { type: String, required: true },
  time: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("History", historySchema);
