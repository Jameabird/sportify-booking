const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  Price: { type: String, required: true },
  Time: { type: String, required: true },
  Booking: { type: Boolean, required: true },
});

const BuildingSchema = new mongoose.Schema(
  {
    Type: { type: String, required: true },
    Building: { type: Map, of: new mongoose.Schema({}, { strict: false }) }, // ✅ Allow any structure
  },
  { strict: false } // ✅ Allow extra fields
);

module.exports = mongoose.models.Building || mongoose.model("Building", BuildingSchema);
