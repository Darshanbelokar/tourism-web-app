const express = require("express");
const connectDB = require("./db");
const TouristSpot = require("./models/TouristSpot");

const app = express();
const PORT = 5000;

// Connect MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Tourism Web App Backend is running 🚀");
});

// Get all tourist spots from DB
app.get("/api/places", async (req, res) => {
  try {
    const spots = await TouristSpot.find();
    res.json(spots);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
