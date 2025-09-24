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

mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB!"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// --------- Routes ---------
app.get("/", (req, res) => res.send("API is running..."));

app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

// --------- Start Server ---------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
