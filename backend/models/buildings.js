const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  Price: { type: String, required: false },
  Booking: { type: Boolean, default: false },
  open: { type: String, required: false },
  close: { type: String, required: false }
});

const BuildingSchema = new mongoose.Schema({
  Type: { type: String },
  Building: {
    type: Map,
    of: new mongoose.Schema({
      type: Map,
      of: FieldSchema // ✅ Now includes all properties
    }),
    required: false
  }
});

const PlaceSchema = new mongoose.Schema({
  type: { type: String , required: false },
  name: { type: String, required: false },
  location: { type: String, required: false },
  link: { type: String, required: false },
  details: { type: String, required: false },
  image: { type: String, required: false }
});


const Building = mongoose.model("Building", BuildingSchema,"Buildings", PlaceSchema);
module.exports = Building;
