import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import apiRoutes from "./routes/api.js";

const app = express();
const PORT = process.env.PORT || 3000;

// --------- CORS Configuration ---------
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, mobile apps)
    if (!origin) return callback(null, true);

    // Allow all localhost ports during development
    if (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1") || origin.startsWith("http://192.168")) {
      return callback(null, true);
    }

    // Allow Vercel deployments
    if (origin.includes("vercel.app") || origin.includes("tourism-web")) {
      return callback(null, true);
    }

    console.log("CORS blocked origin:", origin);
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// --------- MongoDB Connection ---------
const MONGODB_URI = process.env.MONGODB_URI || 
  "mongodb+srv://sample_user_1:darshan123@tourismapp.lxpc4az.mongodb.net/tourismApp?retryWrites=true&w=majority";

// Function to run migrations
const runMigrations = async () => {
  try {
    console.log('🔄 Running database migrations...');
    
    // Import and run migrations
    const removeUniqueConstraint = (await import('./migrations/removeUniqueConstraint.js')).default;
    const addEmailVerificationFields = (await import('./migrations/addEmailVerificationFields.js')).default;
    
    console.log('� Running removeUniqueConstraint migration...');
    await removeUniqueConstraint();
    
    console.log('📧 Running email verification fields migration...');
    await addEmailVerificationFields();
    
    console.log('✅ All migrations completed successfully');
  } catch (error) {
    console.log('ℹ️ Migration error (may already be applied):', error.message);
  }
};

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB!");
    // Run migrations after successful connection
    await runMigrations();
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

// --------- Routes ---------
app.get("/", (req, res) => res.send("API is running..."));
app.get("/health", (req, res) => res.json({ status: "OK", timestamp: new Date() }));
app.get("/test", (req, res) => res.json({ message: "Test endpoint working", timestamp: new Date() }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

// --------- Start Server ---------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
