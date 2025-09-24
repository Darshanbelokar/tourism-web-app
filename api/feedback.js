import mongoose from "mongoose";
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define Feedback Schema
const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    targetType: {
      type: String,
      enum: ['spot', 'guide', 'vendor', 'product', 'transport', 'booking'],
      required: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'targetType'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: {
      type: String,
      maxlength: 100
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000
    },
    sentiment: {
      score: { type: Number, min: -1, max: 1 },
      label: {
        type: String,
        enum: ['positive', 'neutral', 'negative']
      },
      confidence: { type: Number, min: 0, max: 1 }
    },
    categories: [{
      type: String,
      enum: ['cleanliness', 'service', 'value', 'location', 'food', 'amenities', 'staff', 'experience']
    }],
    tags: [String],
    isVerified: {
      type: Boolean,
      default: false
    },
    helpful: {
      count: { type: Number, default: 0 },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      // GET feedback with query parameters
      const { targetType, targetId, user, rating, sentiment } = req.query;
      let query = { isActive: true };

      if (targetType) query.targetType = targetType;
      if (targetId) {
        if (mongoose.Types.ObjectId.isValid(targetId)) {
          query.targetId = targetId;
        } else {
          return res.json([]);
        }
      }
      if (user) query.user = user;
      if (rating) query.rating = Number(rating);
      if (sentiment) query.sentiment.label = sentiment;

      const feedback = await Feedback.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
      res.json(feedback);

    } else if (req.method === 'POST') {
      // POST new feedback
      const newFeedback = new Feedback(req.body);
      const savedFeedback = await newFeedback.save();
      res.json(savedFeedback);

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Feedback API Error:', error);
    res.status(500).json({ error: error.message });
  }
}