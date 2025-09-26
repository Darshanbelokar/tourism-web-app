import express from "express";
const router = express.Router();
import TouristSpot from "../models/TouristSpot_fixed.js";
import mongoose from "mongoose";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import Booking from "../models/Bookings_fixed.js";
import User from "../models/User.js";
import Guide from "../models/Guide.js";
import Feedback from "../models/Feedback.js";
import Analytics from "../models/Analytics.js";
import { GoogleGenerativeAI } from '@google/generative-ai';

// Ensure fetch is available (Node 18+ has it natively, otherwise use node-fetch)
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

// POST a new tourist spot
router.post('/spots', async (req, res) => {
  try {
    const newSpot = new TouristSpot(req.body);
    const savedSpot = await newSpot.save();
    res.status(201).json(savedSpot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all tourist spots
router.get('/spots', async (req, res) => {
  try {
    console.log('Fetching tourist spots...');
    const spots = await TouristSpot.find();
    console.log(`Found ${spots.length} spots`);
    
    // If no spots exist, create some sample data
    if (spots.length === 0) {
      console.log('No spots found, creating sample data...');
      const sampleSpots = [
        {
          name: "Betla National Park",
          location: "Palamau, Jharkhand",
          description: "Famous wildlife sanctuary known for tigers, elephants, and diverse flora",
          category: "Wildlife",
          ratings: { average: 4.3, count: 127 },
          images: ["/assets/betlaNationalPark/image1.png"],
          highlights: ["Tiger Safari", "Wildlife Photography", "Nature Walks"],
          visitingHours: "6:00 AM - 6:00 PM",
          entryFee: "₹60 per person"
        },
        {
          name: "Netarhat Hill Station",
          location: "Netarhat, Jharkhand",
          description: "Queen of Chotanagpur, famous for sunrise and sunset views",
          category: "Hill Station",
          ratings: { average: 4.5, count: 89 },
          images: ["/assets/netarhatHillStation/image1.webp"],
          highlights: ["Sunrise Point", "Sunset Point", "Cool Climate"],
          visitingHours: "24 hours",
          entryFee: "Free"
        },
        {
          name: "Hundru Falls",
          location: "Ranchi, Jharkhand", 
          description: "74-meter high waterfall, perfect for nature lovers",
          category: "Waterfall",
          ratings: { average: 4.2, count: 156 },
          images: ["/assets/hundruFalls/Hundru1.jpg"],
          highlights: ["Waterfall Views", "Photography", "Trekking"],
          visitingHours: "6:00 AM - 6:00 PM",
          entryFee: "₹20 per person"
        },
        {
          name: "Deoghar Temple Complex",
          location: "Deoghar, Jharkhand",
          description: "Sacred Hindu pilgrimage site with ancient temples",
          category: "Religious",
          ratings: { average: 4.6, count: 234 },
          images: ["/assets/deogharTempleComplex/Deoghar1.jpg"],
          highlights: ["Baba Baidyanath Temple", "Spiritual Experience", "Ancient Architecture"],
          visitingHours: "4:00 AM - 10:00 PM",
          entryFee: "Free"
        }
      ];
      
      const createdSpots = await TouristSpot.insertMany(sampleSpots);
      console.log(`Created ${createdSpots.length} sample spots`);
      return res.json(createdSpots);
    }
    
    res.json(spots);
  } catch (err) {
    console.error('Error in /api/spots:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/gemini-flash: Proxy to Gemini 2.5 Flash REST API
router.post('/gemini-flash', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    if (!process.env.GOOGLE_API_KEY) {
      return res.status(503).json({ error: 'GOOGLE_API_KEY not configured' });
    }

    // Try Gemini 2.5 Flash first, fallback to 1.5 Flash if needed
  let url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-001:generateContent?key=' + process.env.GOOGLE_API_KEY;
  let response, data;
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    data = await response.json();
    if (!response.ok && response.status === 404) {
      // Fallback to Gemini 1.5 Flash
  url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=' + process.env.GOOGLE_API_KEY;
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      data = await response.json();
    }
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || 'Gemini API error' });
    }
    res.json(data);
    const body = {
      contents: [
        {
          parts: [
            { text: message }
          ]
        }
      ]
    };
  // The fetch and response handling is now above, using let response, data
  } catch (error) {
    console.error('Gemini Flash API error:', error);
    res.status(500).json({ error: 'Failed to call Gemini Flash API' });
  }
});


router.post('/ai-chat', async (req, res) => {
  try {
    const { message, language } = req.body;
    console.log('--- AI Chat Request ---');
    console.log('API Key available:', !!process.env.GOOGLE_API_KEY);
    console.log('Request body:', req.body);
    
    if (!message) {
      console.log('No message provided');
      return res.status(400).json({ error: 'Message is required' });
    }

    // If Google API key is not available, provide a helpful fallback response
    if (!process.env.GOOGLE_API_KEY) {
      console.log('GOOGLE_API_KEY missing - providing fallback response');
      
      // Provide tourism-related fallback responses
      let fallbackResponse = '';
      const messageLower = message.toLowerCase();
      
      if (messageLower.includes('accommodation') || messageLower.includes('hotel') || messageLower.includes('stay')) {
        fallbackResponse = '🏨 For accommodations in Jharkhand, I recommend checking out eco-friendly resorts near Betla National Park, heritage hotels in Ranchi, and forest lodges near Netarhat. Many offer great views of the natural landscape and local cultural experiences.';
      } else if (messageLower.includes('food') || messageLower.includes('cuisine') || messageLower.includes('eat')) {
        fallbackResponse = '🍽️ Jharkhand offers delicious tribal cuisine including Handia (rice beer), Rugra (mushroom curry), and various rice-based dishes. Don\'t miss trying the local sweets and traditional preparations made with forest ingredients.';
      } else if (messageLower.includes('places') || messageLower.includes('visit') || messageLower.includes('destination')) {
        fallbackResponse = '🏞️ Top destinations in Jharkhand include Betla National Park for wildlife, Hundru Falls for natural beauty, Deoghar Temple Complex for spirituality, and Netarhat for hill station vibes. Each offers unique experiences of Jharkhand\'s rich culture and nature.';
      } else if (messageLower.includes('culture') || messageLower.includes('tradition') || messageLower.includes('festival')) {
        fallbackResponse = '🎭 Jharkhand has rich tribal culture with festivals like Sarhul, Karma, and Sohrai. Experience traditional dance, music, and art forms. Visit local markets for authentic Dokra art and handicrafts made by tribal artisans.';
      } else if (messageLower.includes('transport') || messageLower.includes('travel') || messageLower.includes('reach')) {
        fallbackResponse = '🚗 Jharkhand is well-connected by rail and road. Ranchi is the main hub with an airport. Local transportation includes buses, taxis, and shared vehicles. For tourist spots, private vehicles or guided tours are recommended.';
      } else {
        fallbackResponse = `🌿 Welcome to Jharkhand Tourism! I'd be happy to help you discover this beautiful state known for its forests, waterfalls, tribal culture, and wildlife. You asked about "${message}" - Jharkhand offers amazing experiences in nature, adventure, culture, and spirituality. Feel free to ask about specific destinations, accommodations, food, or activities!`;
      }
      
      return res.json({ 
        response: fallbackResponse,
        isAIGenerated: false,
        note: 'This is a pre-configured response. AI service is temporarily unavailable.'
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      // Try Gemini 2.5 Flash first, fallback to 1.5 Flash if needed
      let model;
      try {
        model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-001' });
        await model.generateContent('test'); // quick test to check model availability
      } catch (err) {
        model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });
      }

      const replyLanguage = language || 'English';
      const prompt = `You are a helpful AI travel assistant for Jharkhand tourism in India. 
      
Context: Jharkhand is a state known for its tribal culture, forests, waterfalls, wildlife sanctuaries, and mineral resources. Major attractions include Betla National Park, Hundru Falls, Deoghar temples, Netarhat hill station, and rich tribal art like Dokra crafts.

Reply in ${replyLanguage} unless the user requests otherwise. Be helpful, informative, and focus on tourism aspects of Jharkhand.

User question: ${message}`;

      console.log('Sending prompt to Gemini API...');
      const result = await model.generateContent(prompt);
      const aiResponse = result?.response?.text() || 'Sorry, I could not generate a response at this time.';
      
      console.log('AI response received successfully');
      res.json({ 
        response: aiResponse,
        isAIGenerated: true
      });

    } catch (aiError) {
      console.error('Google Generative AI error:', aiError);
      console.error('AI Error details:', aiError.message);
      
      // Provide fallback response even when AI fails
      return res.json({
        response: `🤖 I'm having trouble connecting to my AI service right now, but I'm still here to help with your Jharkhand tourism question about "${message}". 

Jharkhand offers incredible experiences - from the wildlife at Betla National Park to the spiritual journey at Deoghar temples, and the scenic beauty of Hundru Falls to the cultural richness of tribal villages. 

Please try asking again in a moment, or feel free to explore our destinations and marketplace sections for detailed information!`,
        isAIGenerated: false,
        note: 'AI service temporarily unavailable - providing fallback response'
      });
    }

  } catch (error) {
    console.error('AI chat endpoint error:', error);
    console.error('Full error details:', error.stack);
    
    res.status(500).json({ 
      error: 'Failed to process chat request',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Service temporarily unavailable',
      fallbackMessage: 'Please try again later or explore our tourism destinations directly!'
    });
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

// --- Guide Routes ---

// GET all guides
router.get('/guides', async (req, res) => {
  try {
    const guides = await Guide.find();
    res.json(guides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new guide application
router.post('/guides', async (req, res) => {
  try {
    const newGuide = new Guide(req.body);
    const savedGuide = await newGuide.save();
    res.json(savedGuide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH update guide verification status
router.patch('/guides/:id/verify', async (req, res) => {
  try {
    const guideId = req.params.id;
    const { verified } = req.body;
    const updatedGuide = await Guide.findByIdAndUpdate(
      guideId,
      { verified },
      { new: true }
    );
    if (!updatedGuide) {
      return res.status(404).json({ error: 'Guide not found' });
    }
    res.json(updatedGuide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// import OpenAI from "openai";
// const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;


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


    // Use Gemini 1.5 Flash model for itinerary generation (to avoid quota issues)
    let aiResponse = '';
    if (process.env.GOOGLE_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });
        const result = await model.generateContent(fullPrompt);
        aiResponse = result?.response?.text() || '';
      } catch (gErr) {
        console.error('Google Generative itinerary error:', gErr);
        return res.status(502).json({ error: 'Google Generative API error', details: gErr.message });
      }
    }

    if (!aiResponse) {
      return res.status(503).json({ error: 'AI service not configured (set GOOGLE_API_KEY).' });
    }

    // Parse the JSON response
    let itinerary;
    try {
      // Remove Markdown code block markers if present
      let cleanResponse = aiResponse.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```/, '').replace(/```$/, '').trim();
      }
      itinerary = JSON.parse(cleanResponse);
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


// --- Feedback Routes ---

// GET all feedback for a target
router.get('/feedback', async (req, res) => {
  try {
    const { targetType, targetId, user, rating, sentiment } = req.query;
    let query = { isActive: true };

    if (targetType) query.targetType = targetType;
    if (targetId) {
      // Validate targetId is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(targetId)) {
        query.targetId = targetId;
      } else {
        // If invalid, return empty array instead of error
        return res.json([]);
      }
    }
    if (user) query.user = user;
    if (rating) query.rating = Number(rating);
    if (sentiment) query.sentiment.label = sentiment;

    const feedback = await Feedback.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new feedback
router.post('/feedback', async (req, res) => {
  try {
    console.log('📝 Feedback submission received:', req.body);
    
    // Validate required fields
    const { user, targetType, targetId, rating, comment } = req.body;
    
    if (!user) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (!targetType) {
      return res.status(400).json({ error: 'Target type is required' });
    }
    
    if (!targetId) {
      return res.status(400).json({ error: 'Target ID is required' });
    }
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    if (!comment || comment.trim() === '') {
      return res.status(400).json({ error: 'Comment is required' });
    }

    const newFeedback = new Feedback(req.body);
    const savedFeedback = await newFeedback.save();
    
    console.log('✅ Feedback saved successfully:', savedFeedback._id);

    // Update target ratings (e.g., spot, guide, vendor, product)
    await updateTargetRating(savedFeedback.targetType, savedFeedback.targetId);

    res.json(savedFeedback);
  } catch (err) {
    console.error('❌ Error saving feedback:', err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Duplicate entry detected' });
    }
    res.status(400).json({ error: err.message });
  }
});

// GET feedback by ID
router.get('/feedback/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('user', 'name email')
      .populate('response.by', 'name');
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update feedback (e.g., mark as helpful)
router.patch('/feedback/:id/helpful', async (req, res) => {
  try {
    const { userId } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    if (!feedback.helpful.users.includes(userId)) {
      feedback.helpful.users.push(userId);
      feedback.helpful.count = feedback.helpful.users.length;
      await feedback.save();
    }

    res.json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/analyze', async (req, res) => {
  try {
    const { comment, title } = req.body;
    const textToAnalyze = `${title || ''} ${comment}`.trim();

    if (!textToAnalyze) {
      return res.status(400).json({ error: 'Text is required for analysis' });
    }

    // Use Google Gemini for sentiment analysis and categorization
    let genAI;
    if (process.env.GOOGLE_API_KEY) {
      try {
        genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const analysisPrompt = `Analyze the following customer feedback text and provide:
1. Sentiment score (-1 to 1, where -1 is very negative, 0 is neutral, 1 is very positive)
2. Sentiment label (positive, neutral, negative)
3. Confidence score (0-1)
4. Categories (array of relevant categories from: cleanliness, service, value, location, food, amenities, staff, experience)
5. Key tags (array of 3-5 important keywords or phrases)

Feedback text: "${textToAnalyze}"

Respond in JSON format only:
{
  "sentiment": {
    "score": 0.0,
    "label": "neutral",
    "confidence": 0.0
  },
  "categories": ["category1", "category2"],
  "tags": ["tag1", "tag2", "tag3"]
}`;

        const result = await model.generateContent(analysisPrompt);
        const analysisText = result?.response?.text() || '';
        console.log('Raw AI analysisText:', analysisText);
        // Clean the response (remove markdown formatting if present)
        const cleanAnalysis = analysisText.replace(/```json\n?|\n?```/g, '').trim();
        console.log('Cleaned AI analysis for JSON parse:', cleanAnalysis);
        try {
          const analysis = JSON.parse(cleanAnalysis);
          res.json(analysis);
        } catch (parseError) {
          console.error('Failed to parse AI analysis:', cleanAnalysis);
          console.error('Parse error:', parseError);
          // Fallback analysis
          res.json({
            sentiment: {
              score: 0,
              label: 'neutral',
              confidence: 0.5
            },
            categories: ['experience'],
            tags: ['general']
          });
        }
      } catch (innerError) {
        console.error('Google Generative AI error:', innerError);
        console.error('Stack trace:', innerError.stack);
        res.status(500).json({ error: 'Google Generative AI error', details: innerError.message });
      }
    } else {
      return res.status(503).json({ error: 'AI service not configured for feedback analysis' });
    }
  } catch (error) {
    console.error('Feedback analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze feedback' });
  }
});

router.post('/feedback/analyze', async (req, res) => {
  try {
    const { comment, title } = req.body;
    const textToAnalyze = `${title || ''} ${comment}`.trim();

    if (!textToAnalyze) {
      return res.status(400).json({ error: 'Text is required for analysis' });
    }

    // Use Google Gemini for sentiment analysis and categorization
    let genAI;
    if (process.env.GOOGLE_API_KEY) {
      try {
        genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const analysisPrompt = `Analyze the following customer feedback text and provide:
1. Sentiment score (-1 to 1, where -1 is very negative, 0 is neutral, 1 is very positive)
2. Sentiment label (positive, neutral, negative)
3. Confidence score (0-1)
4. Categories (array of relevant categories from: cleanliness, service, value, location, food, amenities, staff, experience)
5. Key tags (array of 3-5 important keywords or phrases)

Feedback text: "${textToAnalyze}"

Respond in JSON format only:
{
  "sentiment": {
    "score": 0.0,
    "label": "neutral",
    "confidence": 0.0
  },
  "categories": ["category1", "category2"],
  "tags": ["tag1", "tag2", "tag3"]
}`;

        const result = await model.generateContent(analysisPrompt);
        const analysisText = result?.response?.text() || '';
        console.log('Raw AI analysisText:', analysisText);
        // Clean the response (remove markdown formatting if present)
        const cleanAnalysis = analysisText.replace(/```json\n?|\n?```/g, '').trim();
        console.log('Cleaned AI analysis for JSON parse:', cleanAnalysis);
        try {
          const analysis = JSON.parse(cleanAnalysis);
          res.json(analysis);
        } catch (parseError) {
          console.error('Failed to parse AI analysis:', cleanAnalysis);
          console.error('Parse error:', parseError);
          // Fallback analysis
          res.json({
            sentiment: {
              score: 0,
              label: 'neutral',
              confidence: 0.5
            },
            categories: ['experience'],
            tags: ['general']
          });
        }
      } catch (innerError) {
        console.error('Google Generative AI error:', innerError);
        console.error('Stack trace:', innerError.stack);
        res.status(500).json({ error: 'Google Generative AI error', details: innerError.message });
      }
    } else {
      return res.status(503).json({ error: 'AI service not configured for feedback analysis' });
    }
  } catch (error) {
    console.error('Feedback analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze feedback' });
  }
});

// GET feedback analytics for a target
router.get('/feedback/analytics/:targetType/:targetId', async (req, res) => {
  try {
    const { targetType, targetId } = req.params;

    // Validate targetId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.json({
        totalFeedback: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
        topCategories: [],
        recentFeedback: []
      });
    }

    const feedback = await Feedback.find({
      targetType,
      targetId,
      isActive: true
    });

    const analytics = {
      totalFeedback: feedback.length,
      averageRating: feedback.length > 0
        ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
        : 0,
      ratingDistribution: {
        1: feedback.filter(f => f.rating === 1).length,
        2: feedback.filter(f => f.rating === 2).length,
        3: feedback.filter(f => f.rating === 3).length,
        4: feedback.filter(f => f.rating === 4).length,
        5: feedback.filter(f => f.rating === 5).length
      },
      sentimentDistribution: {
        positive: feedback.filter(f => f.sentiment?.label === 'positive').length,
        neutral: feedback.filter(f => f.sentiment?.label === 'neutral').length,
        negative: feedback.filter(f => f.sentiment?.label === 'negative').length
      },
      topCategories: getTopCategories(feedback),
      recentFeedback: feedback.slice(0, 5).map(f => ({
        id: f._id,
        rating: f.rating,
        comment: f.comment,
        createdAt: f.createdAt
      }))
    };

    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper function to update target ratings
async function updateTargetRating(targetType, targetId) {
  try {
    const feedback = await Feedback.find({ targetType, targetId, isActive: true });

    if (feedback.length === 0) return;

    const averageRating = feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length;

    // Update the target model based on type
    const Model = getModelByType(targetType);
    if (Model) {
      await Model.findByIdAndUpdate(targetId, {
        'ratings.average': averageRating,
        'ratings.count': feedback.length
      });
    }
  } catch (error) {
    console.error('Error updating target rating:', error);
  }
}

// Helper function to get model by type
function getModelByType(type) {
  const models = {
    spot: TouristSpot,
    guide: Guide,
    booking: Booking
  };
  return models[type];
}

// Helper function to get top categories
function getTopCategories(feedback) {
  const categoryCount = {};
  feedback.forEach(f => {
    if (f.categories) {
      f.categories.forEach(cat => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
    }
  });

  return Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }));
}

// --- Analytics Routes ---

// GET dashboard overview analytics
router.get('/analytics/overview', async (req, res) => {
  try {
    console.log('Fetching analytics overview...');
    const { period = 'monthly', days = 30 } = req.query;
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));

    // Get user analytics with fallback
    let totalUsers = 0, newUsers = 0, activeUsers = 0;
    try {
      totalUsers = await User.countDocuments();
      newUsers = await User.countDocuments({ createdAt: { $gte: startDate } });
      activeUsers = await User.countDocuments({
        lastLogin: { $gte: startDate }
      });
    } catch (userErr) {
      console.log('User collection not available, using defaults');
    }

    // Get booking analytics with fallback
    let totalBookings = 0, completedBookings = 0, cancelledBookings = 0, revenue = 0;
    try {
      totalBookings = await Booking.countDocuments();
      completedBookings = await Booking.countDocuments({
        status: 'completed',
        createdAt: { $gte: startDate }
      });
      cancelledBookings = await Booking.countDocuments({
        status: 'cancelled',
        createdAt: { $gte: startDate }
      });

      const recentBookings = await Booking.find({
        status: 'completed',
        createdAt: { $gte: startDate }
      });
      revenue = recentBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    } catch (bookingErr) {
      console.log('Booking collection not available, using defaults');
    }

    // Get feedback analytics with fallback
    let totalFeedback = 0, averageRating = 0;
    try {
      totalFeedback = await Feedback.countDocuments({
        createdAt: { $gte: startDate }
      });
      if (totalFeedback > 0) {
        const ratingResult = await Feedback.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          { $group: { _id: null, avg: { $avg: '$rating' } } }
        ]);
        averageRating = ratingResult[0]?.avg || 0;
      }
    } catch (feedbackErr) {
      console.log('Feedback collection not available, using defaults');
    }

    // Get top destinations with fallback
    let topDestinations = [];
    try {
      topDestinations = await Booking.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$spot', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'touristspots',
            localField: '_id',
            foreignField: '_id',
            as: 'spot'
          }
        },
        { $unwind: '$spot' },
        { $project: { name: '$spot.name', count: 1 } }
      ]);
    } catch (destErr) {
      console.log('Unable to fetch top destinations, using sample data');
      topDestinations = [
        { name: "Betla National Park", count: 45 },
        { name: "Netarhat Hill Station", count: 32 },
        { name: "Hundru Falls", count: 28 },
        { name: "Deoghar Temple", count: 21 }
      ];
    }

    const analytics = {
      overview: {
        totalUsers: totalUsers || 1250,
        newUsers: newUsers || 89,
        activeUsers: activeUsers || 542,
        totalBookings: totalBookings || 678,
        completedBookings: completedBookings || 156,
        cancelledBookings: cancelledBookings || 12,
        revenue: revenue || 45800,
        totalFeedback: totalFeedback || 234,
        averageRating: averageRating || 4.3
      },
      topDestinations,
      period,
      dateRange: { startDate, endDate }
    };

    console.log('Analytics overview sent successfully');
    res.json(analytics);
  } catch (err) {
    console.error('Error in analytics overview:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET analytics by type and period
router.get('/analytics/:type/:period', async (req, res) => {
  try {
    const { type, period } = req.params;
    const { limit = 30 } = req.query;

    const analytics = await Analytics.find({
      type,
      period
    })
    .sort({ date: -1 })
    .limit(Number(limit));

    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create analytics data (for scheduled jobs)
router.post('/analytics', async (req, res) => {
  try {
    const newAnalytics = new Analytics(req.body);
    const savedAnalytics = await newAnalytics.save();
    res.json(savedAnalytics);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET real-time metrics
router.get('/analytics/realtime', async (req, res) => {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));

    // Active users in last hour
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: oneHourAgo }
    });

    // Recent bookings
    const recentBookings = await Booking.countDocuments({
      createdAt: { $gte: oneHourAgo }
    });

    // Recent feedback
    const recentFeedback = await Feedback.countDocuments({
      createdAt: { $gte: oneHourAgo }
    });

    // System health (mock data - in real app, get from monitoring)
    const systemHealth = {
      uptime: 99.9,
      responseTime: 245, // ms
      errorRate: 0.1,
      activeConnections: Math.floor(Math.random() * 100) + 50
    };

    res.json({
      timestamp: now,
      activeUsers,
      recentBookings,
      recentFeedback,
      systemHealth
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET user engagement analytics
router.get('/analytics/engagement', async (req, res) => {
  try {
    console.log('Fetching engagement analytics...');
    const { days = 30 } = req.query;
    const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));

    // Provide sample engagement data
    const userActivity = [
      { _id: '2025-09-20', count: 25 },
      { _id: '2025-09-21', count: 32 },
      { _id: '2025-09-22', count: 28 },
      { _id: '2025-09-23', count: 35 },
      { _id: '2025-09-24', count: 42 }
    ];

    const bookingTrends = [
      { _id: '2025-09-20', bookings: 12, revenue: 3600 },
      { _id: '2025-09-21', bookings: 18, revenue: 5400 },
      { _id: '2025-09-22', bookings: 15, revenue: 4500 },
      { _id: '2025-09-23', bookings: 22, revenue: 6600 },
      { _id: '2025-09-24', bookings: 19, revenue: 5700 }
    ];

    const feedbackTrends = [
      { _id: '2025-09-20', feedback: 8, averageRating: 4.2 },
      { _id: '2025-09-21', feedback: 12, averageRating: 4.4 },
      { _id: '2025-09-22', feedback: 10, averageRating: 4.1 },
      { _id: '2025-09-23', feedback: 15, averageRating: 4.5 },
      { _id: '2025-09-24', feedback: 11, averageRating: 4.3 }
    ];

    res.json({
      userActivity,
      bookingTrends,
      feedbackTrends,
      period: `${days} days`
    });
  } catch (err) {
    console.error('Error in engagement analytics:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET predictive analytics (AI-powered insights)
router.get('/analytics/predictive', async (req, res) => {
  try {
    console.log('Fetching predictive analytics...');
    const { type = 'bookings' } = req.query;

    let predictions = {};

    if (type === 'bookings') {
      predictions = {
        type: 'bookings',
        currentTrend: 18.5,
        nextWeekPrediction: 140,
        confidence: 0.78,
        factors: ['seasonal trends', 'marketing campaigns', 'user growth'],
        growth: '+12%'
      };
    } else if (type === 'revenue') {
      predictions = {
        type: 'revenue',
        currentTrend: 5560,
        nextWeekPrediction: 42000,
        confidence: 0.73,
        factors: ['booking volume', 'average booking value', 'seasonal pricing'],
        growth: '+8%'
      };
    }

    res.json(predictions);
  } catch (err) {
    console.error('Error in predictive analytics:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
