// Shared utilities for Netlify Functions
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// MongoDB connection singleton
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    cachedDb = mongoose.connection;
    console.log('MongoDB connected successfully');
    return cachedDb;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  image: { type: String },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      userId: String,
      username: String,
      rating: Number,
      comment: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  addedAt: { type: Date, default: Date.now },
});

// Cart Schema
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now },
});

// Order Item Schema
const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: String,
  price: Number,
  quantity: { type: Number, required: true },
});

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  paymentMethod: { type: String, enum: ['stripe', 'paypal', 'credit_card'], required: true },
  stripePaymentIntentId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create or retrieve models (prevents OverwriteModelError)
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// JWT Authentication Helper
function authenticateToken(authHeader) {
  if (!authHeader) {
    return { error: 'Access token required', statusCode: 401 };
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return { error: 'Access token required', statusCode: 401 };
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return { user };
  } catch (err) {
    return { error: 'Invalid or expired token', statusCode: 403 };
  }
}

// Standard response helper
function createResponse(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      ...headers,
    },
    body: JSON.stringify(body),
  };
}

// Handle OPTIONS requests for CORS
function handleCORS(event) {
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, {});
  }
  return null;
}

module.exports = {
  connectToDatabase,
  User,
  Product,
  Cart,
  Order,
  authenticateToken,
  createResponse,
  handleCORS,
};
