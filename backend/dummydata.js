const mongoose = require("mongoose");
const connectDB = require("./db");
const TouristSpot = require("./models/TouristSpot");
const User = require("./models/User");

connectDB();

const createDummyData = async () => {
  try {
    // Clear existing data
    await TouristSpot.deleteMany({});
    await User.deleteMany({});

    // --- Tourist Spots in Jharkhand ---
    const spots = [
      {
        name: "Jonha Falls",
        location: "Ranchi, Jharkhand",
        description: "A beautiful waterfall surrounded by lush greenery, perfect for picnics and photography.",
        images: ["https://example.com/jonha1.jpg", "https://example.com/jonha2.jpg"],
        price: 100
      },
      {
        name: "Dassam Falls",
        location: "Ranchi, Jharkhand",
        description: "Spectacular waterfall on the Kanchi River, ideal for nature lovers.",
        images: ["https://example.com/dassam1.jpg"],
        price: 80
      },
      {
        name: "Betla National Park",
        location: "Palamu, Jharkhand",
        description: "Famous wildlife sanctuary with tigers, elephants, and rich biodiversity.",
        images: ["https://example.com/betla1.jpg", "https://example.com/betla2.jpg"],
        price: 500
      },
      {
        name: "Baidyanath Temple",
        location: "Deoghar, Jharkhand",
        description: "One of the 12 Jyotirlingas of India and a major pilgrimage site.",
        images: ["https://example.com/baidyanath1.jpg"],
        price: 50
      },
      {
        name: "Ranchi Hill",
        location: "Ranchi, Jharkhand",
        description: "Scenic hill with panoramic views of the city and surrounding landscapes.",
        images: ["https://example.com/ranchi1.jpg"],
        price: 70
      }
    ];

    await TouristSpot.insertMany(spots);
    console.log("✅ Tourist Spots created (Jharkhand)");

    // --- Dummy Users ---
    const users = [
      { name: "Om Moraskar", email: "om@example.com", password: "123456" },
      { name: "Anita Sharma", email: "anita@example.com", password: "abcdef" }
    ];

    await User.insertMany(users);
    console.log("✅ Users created");

    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

createDummyData();
