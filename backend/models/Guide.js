import mongoose from "mongoose";

const guideSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String },
    languages: [{ type: String }],
    verified: { type: Boolean, default: false },
    verificationDocuments: [{ type: String }], // URLs or file references
    rating: { type: Number, default: 0 },
    reviews: [{ 
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: Number,
      comment: String,
      date: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Guide = mongoose.models.Guide || mongoose.model("Guide", guideSchema);

export default Guide;
