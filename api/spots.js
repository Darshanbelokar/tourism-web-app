import mongoose from "mongoose";

// Define Tourist Spot Schema directly in the serverless function
const TouristSpotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: String,
  images: [String],
  price: Number,
  createdAt: { type: Date, default: Date.now },
});

// Use existing model if available, or create new one
const TouristSpot = mongoose.models.TouristSpot || mongoose.model("TouristSpot", TouristSpotSchema);

// MongoDB connection
let cachedClient = null;
async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tourism-web-app';
  
  try {
    cachedClient = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return cachedClient;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      // GET all tourist spots
      const spots = await TouristSpot.find();
      res.status(200).json(spots);
    } else if (req.method === 'POST') {
      // POST a new tourist spot
      const newSpot = new TouristSpot(req.body);
      const savedSpot = await newSpot.save();
      res.status(201).json(savedSpot);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}