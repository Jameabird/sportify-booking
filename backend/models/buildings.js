const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  Price: { type: String, required: false },
  Booking: { type: Boolean, default: false },
  open: { type: String, required: false },
  close: { type: String, required: false }
});

const BuildingSchema = new mongoose.Schema({
  Type: { type: String, required: true },
  Building: {
    type: Map,
    of: new mongoose.Schema({
      type: Map,
      of: FieldSchema // ✅ Now includes all properties
    })
  }
});

const Building = mongoose.model("Building", BuildingSchema);
module.exports = Building;
