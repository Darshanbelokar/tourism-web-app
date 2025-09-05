import mongoose from 'mongoose';

const TouristSpotSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: String,
    images: [String],
    price: Number,
    createdAt: { type: Date, default: Date.now },
});

const TouristSpot = mongoose.model("TouristSpot", TouristSpotSchema);

export default TouristSpot;