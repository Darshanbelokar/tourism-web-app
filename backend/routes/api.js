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

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI client
const genAI = process.env.GOOGLE_API_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY) : null;

router.post('/ai-chat', async (req, res) => {
  try {
    const { message, language, conversationHistory } = req.body;

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

    // Build conversation history (text fallback for Google)
    const historySlice = Array.isArray(conversationHistory) ? conversationHistory.slice(-6) : [];

    let conversationText = systemPrompt + "\n\n";
    historySlice.forEach(msg => {
      conversationText += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content || msg.text || ''}\n`;
    });
    conversationText += `User: ${message}`;

    if (process.env.GOOGLE_API_KEY && genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(conversationText);
        const aiResponse = result?.response?.text() || '';
        return res.json({ response: aiResponse });
      } catch (apiError) {
        console.error('Google Generative API call error:', apiError);
        return res.status(502).json({ error: 'Google Generative API error', details: apiError.message });
      }
    } else {
      return res.status(503).json({ error: 'AI service not configured on server (set GOOGLE_API_KEY).' });
    }
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

    const fullPrompt = systemPrompt + "\n\n" + userPrompt;

    // Prefer Google Gemini if configured
    let aiResponse = '';
    if (process.env.GOOGLE_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        // use text-bison for longer textual output / structured content
        const model = genAI.getGenerativeModel({ model: 'models/text-bison-001' });
        const result = await model.generateContent(fullPrompt);
        aiResponse = result?.response?.text() || '';
      } catch (gErr) {
        console.error('Google Generative itinerary error:', gErr);
        // fall back to OpenAI if available
        if (openai) {
          console.warn('Falling back to OpenAI itinerary generation due to Google API error');
        } else {
          return res.status(502).json({ error: 'Google Generative API error', details: gErr.message });
        }
      }
    }

    if (!aiResponse) {
      if (openai) {
        try {
          const completion = await openai.chat.completions.create({
            model: DEFAULT_ITINERARY_MODEL,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            max_tokens: 2000,
            temperature: 0.7,
          });
          aiResponse = completion?.choices?.[0]?.message?.content || '';
        } catch (oErr) {
          console.error('OpenAI itinerary error:', oErr);
          return res.status(502).json({ error: 'OpenAI API error' });
        }
      } else {
        return res.status(503).json({ error: 'AI service not configured (set GOOGLE_API_KEY or OPENAI_API_KEY).' });
      }
    }

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

// List available AI models (Google Generative API if configured, otherwise OpenAI)
router.get('/ai/models', async (req, res) => {
  try {
    // Prefer Google Generative AI
    if (process.env.GOOGLE_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        // listModels is what the earlier error suggested; adapt if the client exposes a different API
        const models = await genAI.listModels();
        return res.json({ provider: 'google', models });
      } catch (gErr) {
        console.error('Google listModels error:', gErr);
        // fall through to OpenAI if available
      }
    }

    // Fallback to OpenAI models list if OpenAI key is configured
    if (openai) {
      try {
        // openai.models.list() returns available models in recent SDKs
        const resp = await openai.models.list();
        return res.json({ provider: 'openai', models: resp.data || resp });
      } catch (oErr) {
        console.error('OpenAI list models error:', oErr);
        return res.status(502).json({ error: 'OpenAI models listing error', details: oErr.message });
      }
    }

    return res.status(503).json({ error: 'AI service not configured (set GOOGLE_API_KEY or OPENAI_API_KEY).' });
  } catch (err) {
    console.error('AI models endpoint error:', err);
    return res.status(500).json({ error: 'Failed to list AI models', details: err.message });
  }
});

export default router;
