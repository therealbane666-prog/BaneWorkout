const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Environment variables
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to BaneWorkout API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      workouts: '/api/workouts',
      exercises: '/api/exercises',
      users: '/api/users'
    }
  });
});

// Placeholder routes
app.get('/api/workouts', (req, res) => {
  res.json({ message: 'Workouts endpoint' });
});

app.get('/api/exercises', (req, res) => {
  res.json({ message: 'Exercises endpoint' });
});

app.get('/api/users', (req, res) => {
  res.json({ message: 'Users endpoint' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      path: req.originalUrl
    }
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n=================================`);
  console.log(`BaneWorkout Server Running`);
  console.log(`=================================`);
  console.log(`Port: ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`=================================\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
