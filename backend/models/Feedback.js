import mongoose from "mongoose";

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
      score: { type: Number, min: -1, max: 1 }, // -1 (negative) to 1 (positive)
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
    tags: [String], // AI-extracted keywords
    isVerified: {
      type: Boolean,
      default: false
    },
    helpful: {
      count: { type: Number, default: 0 },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    response: {
      by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: String,
      date: { type: Date }
    },
    metadata: {
      device: String,
      platform: String,
      language: String,
      ipAddress: String
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

// Index for efficient queries
feedbackSchema.index({ targetType: 1, targetId: 1 });
// Remove unique constraint to allow multiple feedback per user per destination
// feedbackSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true }); 
feedbackSchema.index({ user: 1, targetType: 1, targetId: 1 }); // Non-unique index for queries
feedbackSchema.index({ 'sentiment.score': 1 });
feedbackSchema.index({ rating: 1 });
feedbackSchema.index({ createdAt: -1 });

const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

export default Feedback;
