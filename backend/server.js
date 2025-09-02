const express = require("express");
const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Tourism Web App Backend is running 🚀");
});

// Example API route
app.get("/api/places", (req, res) => {
  res.json([
    { id: 1, name: "Taj Mahal", location: "Agra" },
    { id: 2, name: "Gateway of India", location: "Mumbai" },
  ]);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
