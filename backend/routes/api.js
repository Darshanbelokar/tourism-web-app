const express = require('express');
const router = express.Router();
const TouristSpot = require('../models/TouristSpot');
const Booking = require('../models/Booking');
const User = require('../models/User');

// --- Tourist Spots ---
// GET all spots
router.get('/spots', async (req, res) => {
  try {
    const spots = await TouristSpot.find();
    res.json(spots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new spot (optional admin)
router.post('/spots', async (req, res) => {
  try {
    const newSpot = new TouristSpot(req.body);
    const savedSpot = await newSpot.save();
    res.json(savedSpot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Bookings ---
// POST a booking
router.post('/bookings', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    res.json(savedBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user').populate('spot');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
