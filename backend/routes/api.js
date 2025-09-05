import express from "express";
const router = express.Router();
import TouristSpot from "../models/TouristSpot_fixed.js";
import mongoose from "mongoose";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import Booking from "../models/Bookings_fixed.js";
import User from "../models/User.js";


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

import OpenAI from "openai";

router.post('/ai-chat', async (req, res) => {
  try {
    const { message, language, conversationHistory } = req.body;

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Prepare context for AI
    const systemPrompt = `You are a multilingual AI travel assistant specializing in Jharkhand tourism. You speak English, Hindi, Santali, Ho, and Kharia languages.

Key information about Jharkhand:
- Famous destinations: Betla National Park, Netarhat Hill Station, Hundru Falls, Deoghar Temple, Parasnath Hill
- Cultural aspects: Tribal communities (Santali, Ho, Kharia), traditional dances, handicrafts, bamboo products
- Cuisine: Dhuska, Bamboo shoot curry, Handia, tribal delicacies
- Activities: Wildlife safari, tribal village visits, eco-trekking, cultural workshops
- Best time to visit: October to March
- Transportation: Ranchi Airport, railway connections, local buses

Always respond in the user's preferred language. Be helpful, informative, and promote sustainable tourism. If asked about other destinations, gently redirect to Jharkhand's attractions.

Current user language: ${language}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-5), // Keep last 5 messages for context
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({
      response: 'Sorry, I\'m having trouble connecting right now. Please try again later.'
    });
  }
});

router.post('/generate-itinerary', async (req, res) => {
  try {
    const {
      destinations,
      duration,
      budget,
      interests,
      groupSize,
      travelStyle
    } = req.body;

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Prepare AI prompt for itinerary generation
    const systemPrompt = `You are an expert AI travel planner specializing in Jharkhand tourism. Create detailed, personalized itineraries that promote sustainable tourism and support local communities.

Key information about Jharkhand:
- Famous destinations: Betla National Park, Netarhat Hill Station, Hundru Falls, Deoghar Temple, Parasnath Hill, Ranchi, Jamshedpur
- Cultural aspects: Tribal communities (Santali, Ho, Kharia), traditional dances, handicrafts, bamboo products
- Cuisine: Dhuska, Bamboo shoot curry, Handia, tribal delicacies, local rice varieties
- Activities: Wildlife safari, tribal village visits, eco-trekking, cultural workshops, photography
- Best time to visit: October to March (avoid monsoon)
- Transportation: Ranchi Airport, railway connections, local buses, private taxis

Create a comprehensive itinerary in JSON format with the following structure:
{
  "title": "Descriptive title based on preferences",
  "duration": "X Days, Y Nights",
  "budget": "Estimated cost per person in INR",
  "rating": 4.5,
  "highlights": ["Array of 4-6 key highlights"],
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "activities": [
        {
          "time": "HH:MM",
          "activity": "Activity description",
          "type": "travel|activity|cultural|meal|accommodation"
        }
      ]
    }
  ]
}

Consider:
- Budget constraints and value for money
- Group size and appropriate activities
- Travel style preferences
- Local community engagement
- Sustainable tourism practices
- Realistic timing and logistics
- Cultural sensitivity and authenticity

Respond ONLY with valid JSON, no additional text.`;

    const userPrompt = `Create an itinerary for:
- Destinations: ${destinations || 'Betla National Park, Netarhat'}
- Duration: ${duration || '3-5 days'}
- Budget: ${budget || 'mid-range'}
- Interests: ${interests || 'wildlife, culture, nature'}
- Group Size: ${groupSize || '2-4 people'}
- Travel Style: ${travelStyle || 'mixed adventure and culture'}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    // Parse the JSON response
    let itinerary;
    try {
      itinerary = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', aiResponse);
      // Fallback to a basic structure
      itinerary = {
        title: "Custom Jharkhand Adventure",
        duration: duration || "3 Days, 2 Nights",
        budget: budget || "₹8,000 per person",
        rating: 4.5,
        highlights: ["Wildlife Safari", "Tribal Village Visit", "Cultural Experience"],
        days: [
          {
            day: 1,
            title: "Arrival and Exploration",
            activities: [
              { time: "09:00", activity: "Arrival at destination", type: "travel" },
              { time: "14:00", activity: "Check-in and rest", type: "accommodation" },
              { time: "16:00", activity: "Local sightseeing", type: "activity" }
            ]
          }
        ]
      };
    }

    res.json(itinerary);
  } catch (error) {
    console.error('AI Itinerary generation error:', error);
    res.status(500).json({
      error: 'Failed to generate itinerary. Please try again.',
      details: error.message
    });
  }
});

export default router;
