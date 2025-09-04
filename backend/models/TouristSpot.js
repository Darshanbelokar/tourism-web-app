const mongoose = require('mongoose');

const TouristSpotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: String,
  images: [String],
  price: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TouristSpot', TouristSpotSchema);
