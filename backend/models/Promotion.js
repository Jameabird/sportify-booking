const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    startdate: Date,
    enddate: Date,
    sale: String,
    free: String,
});

const Promotion = mongoose.model("Promotion", promotionSchema);
module.exports = Promotion;
