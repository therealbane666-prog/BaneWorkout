// Login User Function
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectToDatabase, User, createResponse, handleCORS } = require('../utils');

exports.handler = async (event, context) => {
  // Handle CORS
  const corsResponse = handleCORS(event);
  if (corsResponse) return corsResponse;

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return createResponse(400, { error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return createResponse(401, { error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return createResponse(401, { error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return createResponse(200, {
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
    return createResponse(500, { error: 'Internal server error' });
  }
};
