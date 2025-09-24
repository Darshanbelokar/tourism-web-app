import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { comment, title } = req.body;
    const textToAnalyze = `${title || ''} ${comment}`.trim();

    if (!textToAnalyze) {
      return res.status(400).json({ error: 'Text is required for analysis' });
    }

    // Use Google Gemini for sentiment analysis
    if (!process.env.GOOGLE_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured for feedback analysis' });
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

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
      res.status(500).json({ error: 'Google Generative AI error', details: innerError.message });
    }
  } catch (error) {
    console.error('Feedback analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze feedback' });
  }
}