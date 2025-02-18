const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["online", "offline"], default: "online" },
  startdate: { type: Date, required: true },
  enddate: { type: Date },
  sale: { type: Number, required: true },
  free: { type: String, required: true },
});

module.exports = mongoose.models.Promotion || mongoose.model("Promotion", PromotionSchema);
