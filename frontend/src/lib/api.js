// API Configuration for separate backend deployment
export const getApiBase = () => {
  // For development
  if (import.meta.env.DEV) {
    return 'http://localhost:3000';
  }
  
  // For production - replace with your actual backend URL
  return import.meta.env.VITE_BACKEND_URL || 'https://your-backend-url.com';
};

// API endpoint helpers
export const apiEndpoints = {
  // Authentication
  login: '/api/auth/login',
  signup: '/api/auth/signup',
  
  // Tourist Spots
  spots: '/api/spots',
  destinations: (id) => `/api/destinations/${id}`,
  
  // Feedback
  feedback: '/api/feedback',
  feedbackByTarget: (targetType, targetId) => `/api/feedback?targetType=${targetType}&targetId=${targetId}`,
  feedbackAnalytics: (targetType, targetId) => `/api/feedback/analytics/${targetType}/${targetId}`,
  feedbackHelpful: (feedbackId) => `/api/feedback/${feedbackId}/helpful`,
  analyze: '/api/analyze',
  
  // AI/Chat
  aiChat: '/api/ai-chat',
  generateItinerary: '/api/generate-itinerary',
  
  // Analytics
  analyticsOverview: '/api/analytics/overview',
  analyticsEngagement: (days) => `/api/analytics/engagement?days=${days}`,
  analyticsPredictive: (type) => `/api/analytics/predictive?type=${type}`,
};

// Utility function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${getApiBase()}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  return response;
};