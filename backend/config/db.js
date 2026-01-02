const mongoose = require('mongoose');

/**
 * MongoDB Connection Configuration
 * Establishes and manages MongoDB database connections with proper error handling
 * and event listeners for connection state changes
 */

const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error(
        'MongoDB URI not found. Please set MONGODB_URI or MONGO_URI environment variable.'
      );
    }

    // Connection options for optimal performance and stability
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Connection pool settings
      maxPoolSize: 10,
      minPoolSize: 5,
      // Socket settings
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      // Retry settings
      retryWrites: true,
      retryReads: true,
      // Application name for MongoDB monitoring
      appName: 'BaneWorkout',
    };

    // Establish MongoDB connection
    const connection = await mongoose.connect(mongoURI, options);

    console.log(
      `✓ MongoDB Connected: ${connection.connection.host}:${connection.connection.port}/${connection.connection.name}`
    );

    return connection;
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Set up event listeners for MongoDB connection state changes
 */
const setupConnectionListeners = () => {
  const db = mongoose.connection;

  /**
   * Event: Connected
   * Fired when MongoDB connection is established successfully
   */
  db.on('connected', () => {
    console.log('✓ Mongoose connected to MongoDB');
  });

  /**
   * Event: Disconnected
   * Fired when the connection is closed or lost
   */
  db.on('disconnected', () => {
    console.warn('⚠ Mongoose disconnected from MongoDB');
  });

  /**
   * Event: Reconnected
   * Fired when the connection is re-established after being lost
   */
  db.on('reconnected', () => {
    console.log('✓ Mongoose reconnected to MongoDB');
  });

  /**
   * Event: Error
   * Fired when there's a connection error
   */
  db.on('error', (error) => {
    console.error(`✗ Mongoose connection error: ${error.message}`);
  });

  /**
   * Event: Open
   * Fired when the connection is open and ready to use
   */
  db.on('open', () => {
    console.log('✓ Mongoose connection open');
  });

  /**
   * Handle process termination and gracefully close the connection
   */
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('✓ Mongoose connection closed due to SIGINT');
      process.exit(0);
    } catch (error) {
      console.error(`✗ Error closing MongoDB connection: ${error.message}`);
      process.exit(1);
    }
  });

  process.on('SIGTERM', async () => {
    try {
      await mongoose.connection.close();
      console.log('✓ Mongoose connection closed due to SIGTERM');
      process.exit(0);
    } catch (error) {
      console.error(`✗ Error closing MongoDB connection: ${error.message}`);
      process.exit(1);
    }
  });
};

/**
 * Initialize database connection and listeners
 */
const initializeDB = async () => {
  try {
    // Establish connection
    await connectDB();

    // Set up event listeners
    setupConnectionListeners();

    console.log('✓ Database initialization completed successfully');
  } catch (error) {
    console.error(`✗ Database initialization failed: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Get connection status
 * @returns {string} Current connection state
 */
const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

// Export functions
module.exports = {
  connectDB,
  setupConnectionListeners,
  initializeDB,
  getConnectionStatus,
  mongoose,
};
