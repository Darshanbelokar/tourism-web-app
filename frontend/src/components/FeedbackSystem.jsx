import React, { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { getApiBase } from '../lib/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function FeedbackSystem({ targetType, targetId }) {
  const [feedback, setFeedback] = useState([]);
  // Placeholder user ID - in a real app, this would come from authentication
  const currentUserId = "507f1f77bcf86cd799439011"; // Valid MongoDB ObjectId

  // Prepare feedback count by year for chart
  const feedbackByYear = useMemo(() => {
    const yearCounts = {};
    feedback.forEach(item => {
      const year = item.createdAt ? new Date(item.createdAt).getFullYear() : 'Unknown';
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });
    // Sort years
    const years = Object.keys(yearCounts).sort();
    return {
      labels: years,
      datasets: [
        {
          label: 'Feedback Count',
          data: years.map(y => yearCounts[y]),
          backgroundColor: 'rgba(59,130,246,0.7)',
          borderRadius: 6,
        }
      ]
    };
  }, [feedback]);
  const [newFeedback, setNewFeedback] = useState({
    title: '',
    comment: '',
    rating: 5,
    destinationId: targetId || ''
  });

  // For dropdown list of destinations
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    // Fetch list of destinations from backend
    const fetchDestinations = async () => {
      try {
        const res = await fetch(`${getApiBase()}/api/spots`);
        if (!res.ok) throw new Error('Failed to fetch destinations');
        const data = await res.json();
        console.log('Fetched destinations:', data);
        // Each spot has _id and name
        const mappedDestinations = data.map(spot => ({ id: spot._id, name: spot.name }));
        console.log('Mapped destinations:', mappedDestinations);
        setDestinations(mappedDestinations);
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setDestinations([]);
      }
    };
    fetchDestinations();
  }, []);

  // Update destinationId in newFeedback when targetId changes
  useEffect(() => {
    setNewFeedback(prev => ({ ...prev, destinationId: targetId || '' }));
  }, [targetId]);

  // Handler for dropdown change
  const handleDestinationChange = (e) => {
    const selectedId = e.target.value;
    setNewFeedback(prev => ({ ...prev, destinationId: selectedId }));
  };

  // Override canSubmitFeedback to check newFeedback.destinationId
  const canSubmitFeedbackNew = newFeedback.destinationId && newFeedback.destinationId !== "default" && newFeedback.destinationId !== null;

  // rest of the code unchanged
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, [targetType, targetId, newFeedback.destinationId]);

  const fetchFeedback = async () => {
    try {
      // Build query parameters
      let queryParams = new URLSearchParams();
      if (targetType) {
        queryParams.append('targetType', targetType);
      }
      if (targetId && targetId !== null && targetId !== 'null') {
        queryParams.append('targetId', targetId);
      }
      
      const feedbackRes = await fetch(`${getApiBase()}/api/feedback?${queryParams.toString()}`);
      let feedbackData = [];
      if (feedbackRes.ok) {
        const feedbackText = await feedbackRes.text();
        try {
          feedbackData = feedbackText ? JSON.parse(feedbackText) : [];
        } catch (e) {
          feedbackData = [];
        }
      }

      // Only fetch analytics if we have a specific targetId
      let analyticsData = null;
      if (targetId && targetId !== null && targetId !== 'null') {
        const analyticsRes = await fetch(`${getApiBase()}/api/feedback/analytics/${targetType}/${targetId}`);
        if (analyticsRes.ok) {
          const analyticsText = await analyticsRes.text();
          try {
            analyticsData = analyticsText ? JSON.parse(analyticsText) : null;
          } catch (e) {
            analyticsData = null;
          }
        }
      }
        }
      }

      setFeedback(feedbackData);
      setAnalytics(analyticsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!newFeedback.destinationId) {
      alert('Please select a destination');
      return;
    }
    
    if (!newFeedback.title.trim()) {
      alert('Please enter a review title');
      return;
    }
    
    if (!newFeedback.comment.trim()) {
      alert('Please enter a detailed review');
      return;
    }

    setSubmitting(true);

    try {
      // First, analyze the feedback with AI
      const analysisRes = await fetch(`${getApiBase()}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newFeedback.title,
          comment: newFeedback.comment
        })
      });
      
      let analysis = {};
      if (analysisRes.ok) {
        analysis = await analysisRes.json();
      } else {
        console.warn('AI analysis failed, using defaults');
        analysis = {
          sentiment: { score: 0, label: 'neutral', confidence: 0.5 },
          categories: ['experience'],
          tags: []
        };
      }

      // Then submit the feedback
      const feedbackPayload = {
        user: currentUserId,
        targetType: targetType || 'spot',
        targetId: newFeedback.destinationId,
        rating: parseInt(newFeedback.rating),
        title: newFeedback.title.trim(),
        comment: newFeedback.comment.trim(),
        sentiment: analysis.sentiment,
        categories: analysis.categories || [],
        tags: analysis.tags || []
      };
      
      console.log('Feedback payload being sent:', feedbackPayload);
      
      const feedbackRes = await fetch(`${getApiBase()}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackPayload)
      });

      if (feedbackRes.ok) {
        alert('Feedback submitted successfully!');
        setNewFeedback({ title: '', comment: '', rating: 5, destinationId: '' });
        fetchFeedback(); // Refresh the feedback list
      } else {
        const errorData = await feedbackRes.json();
        console.error('Backend error response:', errorData);
        throw new Error(errorData.error || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(`Error submitting feedback: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (feedbackId) => {
    try {
      await fetch(`${getApiBase()}/api/feedback/${feedbackId}/helpful`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'current-user-id' }) // Replace with actual user ID
      });
      fetchFeedback(); // Refresh to update helpful count
    } catch (error) {
      console.error('Error marking feedback as helpful:', error);
    }
  };

  if (loading) return <div>Loading feedback...</div>;

  return (
    <div className="feedback-system max-w-4xl mx-auto p-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl border border-blue-100">
      <div className="text-center mb-8">
        <h3 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Feedback & Reviews
        </h3>
        <p className="text-gray-600 text-lg">Share your experience and help others discover amazing destinations</p>
      </div>

      {analytics && (
        <div className="analytics mb-10 p-8 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-2xl border border-blue-200 shadow-lg">
          <h4 className="font-bold text-2xl mb-6 text-center text-blue-800">Analytics Overview</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl shadow-md px-6 py-4 text-center transform hover:scale-105 transition-transform duration-200">
              <span className="block text-gray-500 text-sm font-medium">Total Reviews</span>
              <span className="font-bold text-2xl text-blue-600">{analytics.totalFeedback || 0}</span>
            </div>
            <div className="bg-white rounded-xl shadow-md px-6 py-4 text-center transform hover:scale-105 transition-transform duration-200">
              <span className="block text-gray-500 text-sm font-medium">Average Rating</span>
              <span className="font-bold text-2xl text-yellow-500">{analytics.averageRating ? analytics.averageRating.toFixed(1) : 'N/A'} ⭐</span>
            </div>
            <div className="bg-white rounded-xl shadow-md px-6 py-4 text-center transform hover:scale-105 transition-transform duration-200">
              <span className="block text-gray-500 text-sm font-medium">Positive</span>
              <span className="font-bold text-2xl text-green-600">{analytics.sentimentDistribution?.positive || 0}</span>
            </div>
            <div className="bg-white rounded-xl shadow-md px-6 py-4 text-center transform hover:scale-105 transition-transform duration-200">
              <span className="block text-gray-500 text-sm font-medium">Neutral</span>
              <span className="font-bold text-2xl text-gray-600">{analytics.sentimentDistribution?.neutral || 0}</span>
            </div>
            <div className="bg-white rounded-xl shadow-md px-6 py-4 text-center transform hover:scale-105 transition-transform duration-200">
              <span className="block text-gray-500 text-sm font-medium">Negative</span>
              <span className="font-bold text-2xl text-red-600">{analytics.sentimentDistribution?.negative || 0}</span>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-10 bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
        <div className="text-center mb-6">
          <h4 className="text-2xl font-bold text-gray-800 mb-2">Share Your Experience</h4>
          <p className="text-gray-600">Your feedback helps improve our service</p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="destination-select" className="block mb-3 font-semibold text-gray-700 text-lg">
            📍 Select Destination
          </label>
          <select
            id="destination-select"
            value={newFeedback.destinationId}
            onChange={handleDestinationChange}
            className="border-2 border-gray-300 p-4 rounded-xl w-full bg-white text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          >
            <option value="">-- Choose your destination --</option>
            {destinations.map(dest => (
              <option key={dest.id} value={dest.id}>{dest.name}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block mb-3 font-semibold text-gray-700 text-lg">⭐ Rate Your Experience</label>
          <div className="flex gap-3 items-center justify-center">
            {[1,2,3,4,5].map(num => (
              <button
                key={num}
                type="button"
                className={`text-4xl px-2 py-1 focus:outline-none transition-all duration-200 transform hover:scale-125 ${
                  newFeedback.rating >= num 
                    ? 'text-yellow-400 filter drop-shadow-lg scale-110' 
                    : 'text-gray-300 hover:text-yellow-300'
                }`}
                onClick={() => setNewFeedback({...newFeedback, rating: num})}
                aria-label={`Rate ${num} star${num > 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
            <span className="ml-4 text-lg font-medium text-gray-600">
              {newFeedback.rating === 1 ? 'Poor' : 
               newFeedback.rating === 2 ? 'Fair' :
               newFeedback.rating === 3 ? 'Good' :
               newFeedback.rating === 4 ? 'Very Good' : 'Excellent'}
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block mb-3 font-semibold text-gray-700 text-lg">💭 Review Title (Optional)</label>
          <input
            type="text"
            placeholder="Give your review a catchy title..."
            value={newFeedback.title}
            onChange={(e) => setNewFeedback({...newFeedback, title: e.target.value})}
            className="border-2 border-gray-300 p-4 rounded-xl w-full text-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
        </div>
        
        <div className="mb-8">
          <label className="block mb-3 font-semibold text-gray-700 text-lg">✍️ Your Detailed Review</label>
          <textarea
            placeholder="Tell us about your experience... What did you enjoy? What could be improved?"
            value={newFeedback.comment}
            onChange={(e) => setNewFeedback({...newFeedback, comment: e.target.value})}
            className="border-2 border-gray-300 p-4 rounded-xl w-full text-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
            rows="5"
            required
          />
        </div>
        
        <div className="text-center">
          <button
            type="submit"
            disabled={submitting || !canSubmitFeedbackNew}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : '🚀 Submit Feedback'}
          </button>
        </div>
      </form>

      <div className="feedback-list">
        <div className="text-center mb-8">
          <h4 className="font-bold text-3xl mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Recent Reviews</h4>
          <p className="text-gray-600 text-lg">See what others are saying about their experiences</p>
        </div>
        
        {feedback.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">🌟</div>
            <h5 className="text-xl font-semibold text-gray-600 mb-2">No reviews yet</h5>
            <p className="text-gray-500">Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {feedback.map(item => (
              <div key={item._id} className="border-2 border-gray-100 p-8 rounded-2xl shadow-lg bg-white hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h5 className="font-bold text-xl text-gray-800 mb-2">{item.title || '🌟 Review'}</h5>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">{'⭐'.repeat(item.rating)}</div>
                      <span className="text-lg font-medium text-gray-600">({item.rating}/5)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleHelpful(item._id)}
                    className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600 px-4 py-2 rounded-full border border-gray-200 hover:border-green-300 transition-all duration-200"
                  >
                    <span className="text-lg">👍</span>
                    Helpful ({item.helpful?.count || 0})
                  </button>
                </div>
                
                <p className="text-gray-700 text-lg leading-relaxed mb-4">{item.comment}</p>
                
                {item.sentiment && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium text-gray-500">AI Analysis:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.sentiment.label === 'positive' ? 'bg-green-100 text-green-700' :
                      item.sentiment.label === 'negative' ? 'bg-red-100 text-red-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.sentiment.label.charAt(0).toUpperCase() + item.sentiment.label.slice(1)} Sentiment
                    </span>
                    <span className="text-xs text-gray-500">
                      ({(item.sentiment.confidence * 100).toFixed(0)}% confidence)
                    </span>
                  </div>
                )}
                
                {item.categories && item.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.categories.map(cat => (
                      <span key={cat} className="inline-block bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-full font-medium">
                        #{cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Feedback Chart by Year */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h4 className="font-bold text-3xl mb-2 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            📊 Feedback Trends
          </h4>
          <p className="text-center text-gray-600 text-lg mb-8">Distribution of feedback over the years</p>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
            <Bar
              data={feedbackByYear}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  title: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    callbacks: {
                      label: (ctx) => `Feedback Count: ${ctx.parsed.y}`
                    }
                  }
                },
                scales: {
                  x: {
                    title: { 
                      display: true, 
                      text: 'Year', 
                      font: { size: 16, weight: 'bold' },
                      color: '#4B5563'
                    },
                    grid: { display: false },
                    ticks: { color: '#6B7280', font: { size: 14 } }
                  },
                  y: {
                    title: { 
                      display: true, 
                      text: 'Number of Reviews', 
                      font: { size: 16, weight: 'bold' },
                      color: '#4B5563'
                    },
                    beginAtZero: true,
                    ticks: { 
                      stepSize: 1,
                      color: '#6B7280',
                      font: { size: 14 }
                    },
                    grid: { color: 'rgba(107, 114, 128, 0.1)' }
                  }
                }
              }}
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedbackSystem;
