// WorkoutBrothers E-commerce API Backend
// Complete Express server with products, shopping cart, orders, and Stripe payment integration

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Import services (with fallback if missing dependencies)
let stripe, stripeClient, emailService, ScheduledJobs;
// Shared scheduler instance (set when MongoDB is connected)
let scheduledJobs = null;
try {
  stripe = require('stripe');
  stripeClient = process.env.STRIPE_SECRET_KEY ? stripe(process.env.STRIPE_SECRET_KEY) : null;
  if (!stripeClient) {
    console.log('⚠️  Stripe not configured - payment features disabled');
  }
} catch (err) {
  console.log('⚠️  Stripe module not available - payment features disabled');
}

try {
  emailService = require('./email-service');
} catch (err) {
  console.log('⚠️  Email service not available - email features disabled');
  emailService = null;
}

try {
  ScheduledJobs = require('./scheduled-jobs');
} catch (err) {
  console.log('⚠️  Scheduled jobs not available - automated tasks disabled');
  ScheduledJobs = null;
}

// Initialize Express app
const app = express();

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: 'Too many admin requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

// Initialize Stripe (only if configured)
if (!stripeClient && process.env.STRIPE_SECRET_KEY) {
  try {
    stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
  } catch (err) {
    console.error('Failed to initialize Stripe:', err.message);
  }
}

// ============================================================================
// DATABASE SETUP
// ============================================================================

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/workoutbrothers', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(err => console.error('MongoDB connection error:', err));

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

// Create Models
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);
const Order = mongoose.model('Order', orderSchema);

// ============================================================================
// AUTHENTICATION MIDDLEWARE & HELPERS
// ============================================================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// PRODUCTS ROUTES
// ============================================================================

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, sortBy, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = {};
    if (sortBy === 'price_low') {
      sortOption.price = 1;
    } else if (sortBy === 'price_high') {
      sortOption.price = -1;
    } else if (sortBy === 'rating') {
      sortOption.rating = -1;
    } else if (sortBy === 'newest') {
      sortOption.createdAt = -1;
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create product (admin only)
app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      image,
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product
app.put('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, stock, image, updatedAt: Date.now() },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add review to product
app.post('/api/products/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const review = {
      userId: req.user.id,
      username: req.user.username,
      rating,
      comment,
    };

    product.reviews.push(review);

    // Calculate average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = (totalRating / product.reviews.length).toFixed(2);

    await product.save();

    res.status(201).json({ message: 'Review added successfully', product });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// SHOPPING CART ROUTES
// ============================================================================

// Get cart
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
      await cart.save();
    }

    // Calculate total price
    const total = cart.items.reduce((sum, item) => {
      return sum + item.productId.price * item.quantity;
    }, 0);

    res.json({ cart, total: total.toFixed(2) });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add item to cart
app.post('/api/cart/items', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid product or quantity' });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    // Check if item already in cart
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.productId');

    // Calculate total
    const total = cart.items.reduce((sum, item) => {
      return sum + item.productId.price * item.quantity;
    }, 0);

    res.status(201).json({ message: 'Item added to cart', cart, total: total.toFixed(2) });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update cart item
app.put('/api/cart/items/:itemId', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const cartItem = cart.items.id(req.params.itemId);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    cartItem.quantity = quantity;
    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.productId');

    const total = cart.items.reduce((sum, item) => {
      return sum + item.productId.price * item.quantity;
    }, 0);

    res.json({ message: 'Cart item updated', cart, total: total.toFixed(2) });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove item from cart
app.delete('/api/cart/items/:itemId', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const cartItem = cart.items.id(req.params.itemId);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    cartItem.deleteOne();
    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.productId');

    const total = cart.items.reduce((sum, item) => {
      return sum + item.productId.price * item.quantity;
    }, 0);

    res.json({ message: 'Item removed from cart', cart, total: total.toFixed(2) });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear cart
app.delete('/api/cart', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();

    res.json({ message: 'Cart cleared', cart });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// ORDERS ROUTES
// ============================================================================

// Get user orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single order
app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Ensure user can only access their own orders
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create order (from cart)
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ error: 'Shipping address and payment method are required' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Create order items
    const items = cart.items.map(item => ({
      productId: item.productId._id,
      productName: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
    }));

    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order
    const order = new Order({
      userId: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'pending',
    });

    await order.save();

    // Send order confirmation email
    if (emailService) {
      try {
        await emailService.sendOrderConfirmation(order, req.user.email);
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
        // Don't fail the order if email fails
      }
    }

    // Clear cart
    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();

    res.status(201).json({
      message: 'Order created successfully',
      order,
      clientSecret: null, // Will be set if Stripe payment
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status (admin only)
app.put('/api/orders/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    ).populate('items.productId');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// STRIPE PAYMENT ROUTES
// ============================================================================

// Create payment intent
app.post('/api/payments/create-intent', authenticateToken, async (req, res) => {
  try {
    if (!stripeClient) {
      return res.status(503).json({ error: 'Payment service not configured' });
    }

    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Get order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Ensure user owns the order
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user.id,
      },
    });

    // Update order with Stripe payment intent ID
    order.stripePaymentIntentId = paymentIntent.id;
    await order.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Confirm payment
app.post('/api/payments/confirm', authenticateToken, async (req, res) => {
  try {
    if (!stripeClient) {
      return res.status(503).json({ error: 'Payment service not configured' });
    }

    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment Intent ID is required' });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Find and update order
    const order = await Order.findOne({
      stripePaymentIntentId: paymentIntentId,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = 'paid';
    order.updatedAt = Date.now();
    await order.save();

    res.json({
      message: 'Payment confirmed successfully',
      order,
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// Webhook for Stripe events
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripeClient) {
    return res.status(503).json({ error: 'Payment service not configured' });
  }

  const sig = req.headers['stripe-signature'];

  try {
    const event = stripeClient.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle payment intent succeeded
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;

      // Update order status
      const order = await Order.findOne({
        stripePaymentIntentId: paymentIntent.id,
      });

      if (order) {
        order.status = 'paid';
        order.updatedAt = Date.now();
        await order.save();
      }
    }

    // Handle payment intent payment failed
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;

      // Update order status
      const order = await Order.findOne({
        stripePaymentIntentId: paymentIntent.id,
      });

      if (order) {
        order.status = 'cancelled';
        order.updatedAt = Date.now();
        await order.save();
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// ============================================================================
// ADMIN DASHBOARD ROUTES
// ============================================================================

// Get dashboard statistics
app.get('/api/admin/stats', authenticateToken, adminLimiter, async (req, res) => {
  try {
    // Get date ranges
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 7);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Total counts
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Revenue statistics
    const allOrders = await Order.find({ status: { $ne: 'cancelled' } });
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    const todayOrders = await Order.find({
      createdAt: { $gte: startOfToday },
      status: { $ne: 'cancelled' }
    });
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    const weekOrders = await Order.find({
      createdAt: { $gte: startOfWeek },
      status: { $ne: 'cancelled' }
    });
    const weekRevenue = weekOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    const monthOrders = await Order.find({
      createdAt: { $gte: startOfMonth },
      status: { $ne: 'cancelled' }
    });
    const monthRevenue = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Order status breakdown
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Top products
    const topProducts = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productName',
          totalSales: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 }
    ]);

    // Low stock products
    const lowStockProducts = await Product.find({
      stock: { $lt: 10, $gt: 0 },
      $nor: [{ stock: { $gte: 999 } }]
    }).select('name stock category').limit(10);

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'username email');

    res.json({
      overview: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue.toFixed(2)
      },
      revenue: {
        today: todayRevenue.toFixed(2),
        week: weekRevenue.toFixed(2),
        month: monthRevenue.toFixed(2)
      },
      orders: {
        today: todayOrders.length,
        week: weekOrders.length,
        month: monthOrders.length,
        byStatus: ordersByStatus
      },
      topProducts,
      lowStockProducts,
      recentOrders
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Trigger manual report (admin only)
app.post('/api/admin/trigger-report', authenticateToken, adminLimiter, async (req, res) => {
  try {
    if (!scheduledJobs) {
      return res.status(503).json({ error: 'Scheduled jobs not available' });
    }

    const stats = await scheduledJobs.triggerWeeklyReport();
    res.json({ message: 'Weekly report generated and sent', stats });
  } catch (error) {
    console.error('Trigger report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Trigger stock check (admin only)
app.post('/api/admin/trigger-stock-check', authenticateToken, adminLimiter, async (req, res) => {
  try {
    if (!scheduledJobs) {
      return res.status(503).json({ error: 'Scheduled jobs not available' });
    }

    const lowStock = await scheduledJobs.triggerStockCheck();
    res.json({ 
      message: 'Stock check completed',
      lowStockCount: lowStock.length,
      products: lowStock
    });
  } catch (error) {
    console.error('Trigger stock check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// UTILITY ROUTES
// ============================================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    services: {
      mongodb: mongoose.connection.readyState === mongoose.STATES.connected ? 'Connected' : 'Disconnected',
      stripe: stripeClient ? 'Configured' : 'Not configured',
      email: emailService ? 'Configured' : 'Not configured',
      scheduledJobs: ScheduledJobs ? 'Enabled' : 'Disabled'
    }
  });
});

// Get categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================================================
// SCHEDULED JOBS INITIALIZATION
// ============================================================================

const initializeScheduledJobs = () => {
  const canInitialize =
    !scheduledJobs &&
    ScheduledJobs &&
    mongoose.connection.readyState === mongoose.STATES.connected;

  if (!canInitialize) {
    console.log('Skipping scheduled jobs initialization', {
      hasInstance: !!scheduledJobs,
      hasScheduler: !!ScheduledJobs,
      readyState: mongoose.connection.readyState
    });
    return;
  }

  try {
    scheduledJobs = new ScheduledJobs({
      Product,
      Order,
      User
    });
    scheduledJobs.start();
  } catch (err) {
    console.error('Failed to start scheduled jobs:', err.message);
  }
};

// Register handlers after mongoose.connect to catch initial and subsequent connections
mongoose.connection.on('connected', initializeScheduledJobs);   // first successful connection
mongoose.connection.on('reconnected', initializeScheduledJobs); // database reconnection
mongoose.connection.on('disconnected', () => {
  if (scheduledJobs) {
    try {
      // Stop running cron jobs while the database is unavailable
      scheduledJobs.stop();
    } catch (err) {
      console.error('Failed to stop scheduled jobs:', err.message);
    }
    scheduledJobs = null;
  }
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n💪 WorkoutBrothers API Server`);
  console.log(`=================================`);
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 MongoDB: ${mongoose.connection.readyState === mongoose.STATES.connected ? '✅ Connected' : '⚠️  Disconnected'}`);
  console.log(`💳 Stripe: ${stripeClient ? '✅ Configured' : '⚠️  Not configured'}`);
  console.log(`📧 Email: ${emailService ? '✅ Configured' : '⚠️  Not configured'}`);
  console.log(`🕐 Scheduled Jobs: ${scheduledJobs ? '✅ Running' : '⚠️  Disabled'}`);
  console.log(`=================================\n`);
});

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  // In production, you might want to restart the process
  // For now, just log it
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // In production, you might want to restart the process
});

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} signal received: closing HTTP server`);
  
  // Stop scheduled jobs
  if (scheduledJobs) {
    scheduledJobs.stop();
  }
  
  // Close server
  server.close(async () => {
    console.log('HTTP server closed');
    
    // Close database connection
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
    }
    
    console.log('Process terminated');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;
