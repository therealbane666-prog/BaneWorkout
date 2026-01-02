const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false // Don't return password by default
    },
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    profilePicture: {
      type: String,
      default: null
    },

    // Email Verification
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: {
      type: String,
      select: false
    },
    emailVerificationTokenExpire: {
      type: Date,
      select: false
    },

    // Fitness Profile
    fitnessProfile: {
      age: Number,
      gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer-not-to-say']
      },
      height: {
        value: Number,
        unit: {
          type: String,
          enum: ['cm', 'inches'],
          default: 'cm'
        }
      },
      weight: {
        value: Number,
        unit: {
          type: String,
          enum: ['kg', 'lbs'],
          default: 'kg'
        }
      },
      fitnessLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'athlete'],
        default: 'beginner'
      },
      fitnessGoals: [
        {
          type: String,
          enum: ['weight-loss', 'muscle-gain', 'endurance', 'flexibility', 'strength', 'overall-health']
        }
      ],
      medicalConditions: [String],
      injuries: [String],
      lastUpdated: Date
    },

    // Programs
    programs: [
      {
        programId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Program'
        },
        enrolledDate: {
          type: Date,
          default: Date.now
        },
        startDate: Date,
        completionDate: Date,
        status: {
          type: String,
          enum: ['active', 'completed', 'paused', 'cancelled'],
          default: 'active'
        },
        progress: {
          type: Number,
          default: 0,
          min: 0,
          max: 100
        },
        completedWorkouts: {
          type: Number,
          default: 0
        },
        totalWorkouts: Number
      }
    ],

    // Orders
    orders: [
      {
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Order'
        },
        orderDate: {
          type: Date,
          default: Date.now
        },
        totalAmount: Number,
        currency: {
          type: String,
          default: 'USD'
        },
        status: {
          type: String,
          enum: ['pending', 'completed', 'failed', 'refunded'],
          default: 'pending'
        },
        items: [
          {
            itemId: mongoose.Schema.Types.ObjectId,
            itemType: {
              type: String,
              enum: ['program', 'subscription', 'merchandise']
            },
            quantity: Number,
            price: Number
          }
        ]
      }
    ],

    // Loyalty Points
    loyaltyPoints: {
      totalPoints: {
        type: Number,
        default: 0,
        min: 0
      },
      availablePoints: {
        type: Number,
        default: 0,
        min: 0
      },
      redeemedPoints: {
        type: Number,
        default: 0,
        min: 0
      },
      pointsHistory: [
        {
          points: Number,
          type: {
            type: String,
            enum: ['earned', 'redeemed', 'expired', 'adjusted'],
            default: 'earned'
          },
          description: String,
          transactionDate: {
            type: Date,
            default: Date.now
          },
          relatedOrderId: mongoose.Schema.Types.ObjectId
        }
      ],
      lastPointsEarned: Date,
      lastPointsRedeemed: Date
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true
    },
    role: {
      type: String,
      enum: ['user', 'trainer', 'admin'],
      default: 'user'
    },

    // Password Reset
    passwordResetToken: {
      type: String,
      select: false
    },
    passwordResetExpire: {
      type: Date,
      select: false
    },

    // Account Management
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: Date,

    // Preferences
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true
      },
      pushNotifications: {
        type: Boolean,
        default: true
      },
      newsletter: {
        type: Boolean,
        default: true
      },
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ 'loyaltyPoints.totalPoints': -1 });
userSchema.index({ 'programs.status': 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.lastName || 'User';
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method to compare provided password with hashed password
 * @param {string} enteredPassword - The password to compare
 * @returns {Promise<boolean>} - Returns true if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords: ' + error.message);
  }
};

/**
 * Method to verify email address
 * @returns {Promise<void>}
 */
userSchema.methods.verifyEmail = async function () {
  try {
    this.isEmailVerified = true;
    this.emailVerificationToken = undefined;
    this.emailVerificationTokenExpire = undefined;
    await this.save();
  } catch (error) {
    throw new Error('Error verifying email: ' + error.message);
  }
};

/**
 * Method to check if email verification token is expired
 * @returns {boolean} - Returns true if token is expired, false otherwise
 */
userSchema.methods.isEmailVerificationTokenExpired = function () {
  if (!this.emailVerificationTokenExpire) {
    return true;
  }
  return new Date() > new Date(this.emailVerificationTokenExpire);
};

/**
 * Method to add loyalty points
 * @param {number} points - Number of points to add
 * @param {string} description - Description of why points were earned
 * @param {ObjectId} relatedOrderId - Optional reference to related order
 * @returns {Promise<void>}
 */
userSchema.methods.addLoyaltyPoints = async function (points, description = '', relatedOrderId = null) {
  try {
    this.loyaltyPoints.totalPoints += points;
    this.loyaltyPoints.availablePoints += points;
    this.loyaltyPoints.lastPointsEarned = new Date();

    this.loyaltyPoints.pointsHistory.push({
      points,
      type: 'earned',
      description,
      transactionDate: new Date(),
      relatedOrderId
    });

    await this.save();
  } catch (error) {
    throw new Error('Error adding loyalty points: ' + error.message);
  }
};

/**
 * Method to redeem loyalty points
 * @param {number} points - Number of points to redeem
 * @param {string} description - Description of redemption
 * @returns {Promise<boolean>} - Returns true if redemption successful, false if insufficient points
 */
userSchema.methods.redeemLoyaltyPoints = async function (points, description = '') {
  try {
    if (this.loyaltyPoints.availablePoints < points) {
      return false;
    }

    this.loyaltyPoints.availablePoints -= points;
    this.loyaltyPoints.redeemedPoints += points;
    this.loyaltyPoints.lastPointsRedeemed = new Date();

    this.loyaltyPoints.pointsHistory.push({
      points,
      type: 'redeemed',
      description,
      transactionDate: new Date()
    });

    await this.save();
    return true;
  } catch (error) {
    throw new Error('Error redeeming loyalty points: ' + error.message);
  }
};

/**
 * Method to check if account is locked
 * @returns {boolean} - Returns true if account is locked, false otherwise
 */
userSchema.methods.isAccountLocked = function () {
  return this.lockUntil && new Date() < new Date(this.lockUntil);
};

/**
 * Method to get user's active programs
 * @returns {Array} - Array of active programs
 */
userSchema.methods.getActivePrograms = function () {
  return this.programs.filter(program => program.status === 'active');
};

/**
 * Method to update fitness profile
 * @param {Object} profileData - Updated fitness profile data
 * @returns {Promise<void>}
 */
userSchema.methods.updateFitnessProfile = async function (profileData) {
  try {
    this.fitnessProfile = {
      ...this.fitnessProfile,
      ...profileData,
      lastUpdated: new Date()
    };
    await this.save();
  } catch (error) {
    throw new Error('Error updating fitness profile: ' + error.message);
  }
};

// Create and export the model
const User = mongoose.model('User', userSchema);
module.exports = User;
