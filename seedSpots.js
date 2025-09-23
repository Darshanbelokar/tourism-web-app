import mongoose from 'mongoose';
import TouristSpot from './backend/models/TouristSpot_fixed.js';

// Replace with your actual MongoDB connection string
const MONGODB_URI = 'mongodb+srv://sample_user_1:darshan123@tourismapp.lxpc4az.mongodb.net/?retryWrites=true&w=majority&appName=TourismApp';

async function seedSpots() {
  await mongoose.connect(MONGODB_URI);

  const spots = [
    {
      name: "Betla National Park",
      location: "Jharkhand, India",
      description: "A beautiful wildlife sanctuary.",
      images: ["https://example.com/betla1.jpg", "https://example.com/betla2.jpg"],
      price: 100
    },
    {
      name: "Netarhat Hill Station",
      location: "Jharkhand, India",
      description: "A scenic hill station.",
      images: ["https://example.com/netarhat1.jpg"],
      price: 120
    },
    {
      name: "Hazaribagh Wildlife Sanctuary",
      location: "Jharkhand, India",
      description: "Wildlife and nature reserve.",
      images: ["https://example.com/hazaribagh1.jpg"],
      price: 90
    },
    {
      name: "Rajrappa Temple",
      location: "Jharkhand, India",
      description: "Famous temple and pilgrimage site.",
      images: ["https://example.com/rajrappa1.jpg"],
      price: 50
    }
  ];

  for (const spotData of spots) {
    const spot = new TouristSpot(spotData);
    await spot.save();
    console.log(`Inserted: ${spot.name}`);
  }

  await mongoose.disconnect();
  console.log('Seeding complete.');
}

seedSpots().catch(err => {
  console.error('Error seeding spots:', err);
});
