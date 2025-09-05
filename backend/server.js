import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import apiRoutes from "./routes/api.js";

const app = express();

const corsOptions = {
  origin: "http://localhost:8080", // Replace with your frontend URL and port
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = 3000;

// Connect to MongoDB
// 🚨 IMPORTANT: REPLACE THE PLACEHOLDER WITH YOUR ACTUAL MONGODB CONNECTION STRING
mongoose.connect("mongodb+srv://sample_user_1:darshan123@tourismapp.lxpc4az.mongodb.net/?retryWrites=true&w=majority&appName=TourismApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB!");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
