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
    if (origin && (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1") || origin.startsWith("http://192.168"))) {
      return callback(null, true);
    }

    // Allow Vercel deployments
    if (origin && (origin.includes("vercel.app") || origin.includes("tourism-web"))) {
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

// Simplified connection without migrations for stable deployment
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

// --------- Routes ---------
app.get("/", (req, res) => {
  res.json({ 
    message: "Jharkhand Tourism API is running!", 
    status: "OK",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

app.get("/test", (req, res) => {
  res.json({ 
    message: "Test endpoint working", 
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

// Global error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// --------- Start Server ---------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at /health`);
});
