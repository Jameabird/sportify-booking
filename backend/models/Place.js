const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  type: { type: String , required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  link: { type: String, required: true },
  details: { type: String, required: true },
  image: { type: String, required: true }
});

module.exports = mongoose.model("Place", PlaceSchema);
