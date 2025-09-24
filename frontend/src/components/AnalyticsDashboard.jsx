import React, { useEffect, useState } from 'react';
import { getApiBase } from '../lib/api';

function AnalyticsDashboard() {
  const [overview, setOverview] = useState(null);
  const [topDestinations, setTopDestinations] = useState([]);
  const [engagement, setEngagement] = useState(null);
  const [predictive, setPredictive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const overviewRes = await fetch(`${getApiBase()}/api/analytics/overview`);
        const overviewData = await overviewRes.json();

        const engagementRes = await fetch(`${getApiBase()}/api/analytics/engagement?days=30`);
        const engagementData = await engagementRes.json();

        const predictiveRes = await fetch(`${getApiBase()}/api/analytics/predictive?type=bookings`);
        const predictiveData = await predictiveRes.json();

        setOverview(overviewData.overview);
        setTopDestinations(overviewData.topDestinations || []);
        setEngagement(engagementData);
        setPredictive(predictiveData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load analytics data.');
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="analytics-dashboard p-4">
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>

      <section className="overview mb-6">
        <h3 className="text-xl font-semibold mb-2">Overview</h3>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <li>Total Users: {overview.totalUsers}</li>
          <li>New Users (30d): {overview.newUsers}</li>
          <li>Active Users (30d): {overview.activeUsers}</li>
          <li>Total Bookings: {overview.totalBookings}</li>
          <li>Completed Bookings: {overview.completedBookings}</li>
          <li>Cancelled Bookings: {overview.cancelledBookings}</li>
          <li>Revenue: ₹{overview.revenue.toLocaleString()}</li>
          <li>Total Feedback: {overview.totalFeedback}</li>
          <li>Average Rating: {overview.averageRating.toFixed(2)}</li>
        </ul>
      </section>

      <section className="top-destinations mb-6">
        <h3 className="text-xl font-semibold mb-2">Top Destinations</h3>
        <ul>
          {topDestinations.map(dest => (
            <li key={dest.name}>
              {dest.name} - {dest.count} bookings
            </li>
          ))}
        </ul>
      </section>

      <section className="engagement mb-6">
        <h3 className="text-xl font-semibold mb-2">User Engagement (Last 30 days)</h3>
        <div>
          <h4 className="font-semibold">User Activity</h4>
          <ul>
            {engagement.userActivity.map(day => (
              <li key={day._id}>{day._id}: {day.count} new users</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Booking Trends</h4>
          <ul>
            {engagement.bookingTrends.map(day => (
              <li key={day._id}>{day._id}: {day.bookings} bookings, ₹{day.revenue.toLocaleString()}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Feedback Trends</h4>
          <ul>
            {engagement.feedbackTrends.map(day => (
              <li key={day._id}>{day._id}: {day.feedback} feedbacks, Avg Rating: {day.averageRating.toFixed(2)}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="predictive mb-6">
        <h3 className="text-xl font-semibold mb-2">Predictive Analytics</h3>
        <p>Current Trend: {predictive.currentTrend.toFixed(2)}</p>
        <p>Next Week Prediction: {predictive.nextWeekPrediction}</p>
        <p>Confidence: {(predictive.confidence * 100).toFixed(1)}%</p>
        <p>Factors: {predictive.factors.join(', ')}</p>
      </section>
    </div>
  );
}

export default AnalyticsDashboard;
