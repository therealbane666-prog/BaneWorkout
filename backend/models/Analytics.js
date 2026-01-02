const mongoose = require('mongoose');

/**
 * Analytics Schema
 * Tracks user events and analytics data for monitoring app usage,
 * user behavior, and performance metrics
 */
const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        'LOGIN',
        'LOGOUT',
        'WORKOUT_START',
        'WORKOUT_END',
        'EXERCISE_COMPLETED',
        'WORKOUT_SAVED',
        'WORKOUT_DELETED',
        'PROFILE_UPDATE',
        'SETTINGS_CHANGE',
        'SOCIAL_SHARE',
        'FOLLOW_USER',
        'UNFOLLOW_USER',
        'VIEW_PROFILE',
        'PAGE_VIEW',
        'ERROR',
        'SEARCH',
        'FILTER_APPLIED',
        'GOAL_SET',
        'GOAL_ACHIEVED',
        'ACHIEVEMENT_UNLOCKED',
        'NOTIFICATION_RECEIVED',
        'NOTIFICATION_CLICKED',
      ],
      index: true,
    },
    metadata: {
      deviceType: {
        type: String,
        enum: ['web', 'mobile', 'tablet', 'unknown'],
        default: 'unknown',
      },
      userAgent: String,
      ipAddress: String,
      sessionId: String,
      location: {
        country: String,
        city: String,
        timezone: String,
      },
      deviceInfo: {
        os: String,
        browser: String,
        appVersion: String,
      },
    },
    entityType: {
      type: String,
      enum: [
        'workout',
        'exercise',
        'user',
        'goal',
        'achievement',
        'social',
        'app',
      ],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    duration: {
      type: Number,
      description: 'Duration in milliseconds for the event',
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'pending'],
      default: 'success',
    },
    errorMessage: String,
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    tags: [String],
  },
  {
    timestamps: true,
    collection: 'analytics',
  }
);

// Compound indexes for common queries
analyticsSchema.index({ userId: 1, timestamp: -1 });
analyticsSchema.index({ eventType: 1, timestamp: -1 });
analyticsSchema.index({ userId: 1, eventType: 1, timestamp: -1 });
analyticsSchema.index({ entityType: 1, entityId: 1, timestamp: -1 });

// TTL index to automatically delete records older than 90 days
analyticsSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

/**
 * Static method to log an event
 * @param {Object} eventData - Event data object
 * @returns {Promise} - Saved analytics document
 */
analyticsSchema.statics.logEvent = async function (eventData) {
  try {
    const analytics = new this(eventData);
    return await analytics.save();
  } catch (error) {
    console.error('Error logging analytics event:', error);
    throw error;
  }
};

/**
 * Static method to get user activity summary
 * @param {ObjectId} userId - User ID
 * @param {Date} startDate - Start date for query
 * @param {Date} endDate - End date for query
 * @returns {Promise} - Activity summary
 */
analyticsSchema.statics.getUserActivitySummary = async function (
  userId,
  startDate,
  endDate
) {
  try {
    return await this.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          timestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
          avgDuration: { $avg: '$duration' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);
  } catch (error) {
    console.error('Error getting user activity summary:', error);
    throw error;
  }
};

/**
 * Static method to get event statistics
 * @param {String} eventType - Event type to query
 * @param {Date} startDate - Start date for query
 * @param {Date} endDate - End date for query
 * @returns {Promise} - Event statistics
 */
analyticsSchema.statics.getEventStats = async function (
  eventType,
  startDate,
  endDate
) {
  try {
    return await this.aggregate([
      {
        $match: {
          eventType,
          timestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          successCount: {
            $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] },
          },
          failureCount: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] },
          },
          avgDuration: { $avg: '$duration' },
          maxDuration: { $max: '$duration' },
          minDuration: { $min: '$duration' },
        },
      },
    ]);
  } catch (error) {
    console.error('Error getting event statistics:', error);
    throw error;
  }
};

/**
 * Instance method to format event data
 * @returns {Object} - Formatted event object
 */
analyticsSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj.__v;
  return obj;
};

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
