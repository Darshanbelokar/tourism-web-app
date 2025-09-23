import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['user', 'booking', 'revenue', 'feedback', 'traffic', 'performance'],
      required: true
    },
    period: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    data: {
      // User analytics
      totalUsers: Number,
      newUsers: Number,
      activeUsers: Number,
      userGrowth: Number,

      // Booking analytics
      totalBookings: Number,
      completedBookings: Number,
      cancelledBookings: Number,
      revenue: Number,
      averageBookingValue: Number,

      // Feedback analytics
      totalFeedback: Number,
      averageRating: Number,
      sentimentScore: Number,
      topCategories: [String],

      // Traffic analytics
      pageViews: Number,
      uniqueVisitors: Number,
      bounceRate: Number,
      topPages: [{
        page: String,
        views: Number
      }],

      // Performance metrics
      responseTime: Number,
      errorRate: Number,
      uptime: Number,
      apiCalls: Number
    },
    metadata: {
      source: String,
      calculatedAt: { type: Date, default: Date.now },
      version: String
    }
  },
  { timestamps: true }
);

// Index for efficient queries
analyticsSchema.index({ type: 1, period: 1, date: -1 });
analyticsSchema.index({ date: -1 });

const Analytics = mongoose.models.Analytics || mongoose.model("Analytics", analyticsSchema);

export default Analytics;
