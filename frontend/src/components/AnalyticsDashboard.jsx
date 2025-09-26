import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
// ...existing code...

function AnalyticsDashboard() {
  // Pie chart data for booking status
  const bookingPieData = {
    labels: ['Completed', 'Cancelled'],
    datasets: [
      {
        data: [156, 12],
        backgroundColor: ['#22c55e', '#ef4444'],
      },
    ],
  };
  // Static data for stat cards
  const statCards = [
    { label: 'Total Users', value: 11 },
    { label: 'New Users (30d)', value: 89 },
    { label: 'Active Users (30d)', value: 542 },
    { label: 'Total Bookings', value: 678 },
    { label: 'Completed Bookings', value: 156 },
    { label: 'Cancelled Bookings', value: 12 },
    { label: 'Revenue', value: '₹45,800' },
    { label: 'Total Feedback', value: 6 },
    { label: 'Average Rating', value: 4.83 },
  ];

  const bookingTrends = [
    { date: '2025-09-20', bookings: 12, revenue: 3600 },
    { date: '2025-09-21', bookings: 18, revenue: 5400 },
    { date: '2025-09-22', bookings: 15, revenue: 4500 },
    { date: '2025-09-23', bookings: 22, revenue: 6600 },
    { date: '2025-09-24', bookings: 19, revenue: 5700 },
  ];

  const feedbackTrends = [
    { date: '2025-09-20', feedbacks: 8, avgRating: 4.20 },
    { date: '2025-09-21', feedbacks: 12, avgRating: 4.40 },
    { date: '2025-09-22', feedbacks: 10, avgRating: 4.10 },
    { date: '2025-09-23', feedbacks: 15, avgRating: 4.50 },
    { date: '2025-09-24', feedbacks: 11, avgRating: 4.30 },
  ];

  return (
    <div className="analytics-dashboard p-4">
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded shadow p-4 flex flex-col items-center">
            <span className="text-lg font-semibold mb-1">{card.label}</span>
            <span className="text-2xl font-bold text-green-700">{card.value}</span>
          </div>
        ))}
      </div>

        {/* Booking Status Pie Chart */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Booking Status</h3>
          <div style={{ maxWidth: 250, margin: '0 auto' }}>
            <Pie data={bookingPieData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { boxWidth: 16, font: { size: 12 } } } } }} />
          </div>
        </section>

      {/* Booking Trends */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Booking Trends</h3>
        <ul className="bg-white rounded shadow p-4">
          {bookingTrends.map(trend => (
            <li key={trend.date} className="mb-1">
              {trend.date}: <span className="font-semibold">{trend.bookings} bookings</span>, <span className="text-green-700">₹{trend.revenue.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Feedback Trends */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Feedback Trends</h3>
        <ul className="bg-white rounded shadow p-4">
          {feedbackTrends.map(trend => (
            <li key={trend.date} className="mb-1">
              {trend.date}: <span className="font-semibold">{trend.feedbacks} feedbacks</span>, Avg Rating: <span className="text-yellow-600">{trend.avgRating.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AnalyticsDashboard;
