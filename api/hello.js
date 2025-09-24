export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.status(200).json({ 
    message: 'Jharkhand Tourism API is running!',
    endpoints: [
      'GET /api/spots - Get all tourist spots',
      'POST /api/spots - Create new tourist spot',
      'GET /api/feedback - Get feedback',
      'POST /api/feedback - Submit feedback',
      'POST /api/analyze - Analyze feedback with AI',
      'POST /api/gemini-flash - Chat with AI'
    ]
  });
}