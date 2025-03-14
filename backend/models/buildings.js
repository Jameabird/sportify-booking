const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  Price: { type: String, required: false },
  Booking: { type: Boolean, default: false },
  open: { type: String, required: false },
  close: { type: String, required: false }
});

const BuildingSchema = new mongoose.Schema({
  Type: { type: String, required: false },
  Building: {
    type: Map, // ✅ Ensures flexible structure
    of: new mongoose.Schema({
      type: Map,
      of: FieldSchema
    }),
    required: false
  },
  userid: { type: String, required: false },
  username: { type: String, required: false },
  name: { type: String, required: false },
  location: { type: String, required: false },
  link: { type: String, required: false },
  details: { type: String, required: false },
  image: { type: String, required: false }
});

const Building = mongoose.model("Building", BuildingSchema);
module.exports = Building;
