import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
  },
  { timestamps: true }
);

// Add index for faster email verification lookups
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ email: 1, isEmailVerified: 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
