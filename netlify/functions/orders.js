// Orders Function - Handles all order operations
const { connectToDatabase, Order, Cart, authenticateToken, createResponse, handleCORS } = require('./utils');

exports.handler = async (event, context) => {
  // Handle CORS
  const corsResponse = handleCORS(event);
  if (corsResponse) return corsResponse;

  // All order operations require authentication
  const authResult = authenticateToken(event.headers.authorization || event.headers.Authorization);
  if (authResult.error) {
    return createResponse(authResult.statusCode, { error: authResult.error });
  }

  try {
    await connectToDatabase();

    const path = event.path.replace('/.netlify/functions/orders', '');
    const method = event.httpMethod;
    const userId = authResult.user.id;

    // GET /api/orders - Get user's orders
    if (method === 'GET' && !path) {
      const orders = await Order.find({ userId })
        .populate('items.productId')
        .sort({ createdAt: -1 });

      return createResponse(200, orders);
    }

    // GET /api/orders/:id - Get single order
    if (method === 'GET' && path && !path.includes('/status')) {
      const orderId = path.replace('/', '');
      const order = await Order.findById(orderId).populate('items.productId');

      if (!order) {
        return createResponse(404, { error: 'Order not found' });
      }

      // Ensure user can only access their own orders
      if (order.userId.toString() !== userId) {
        return createResponse(403, { error: 'Access denied' });
      }

      return createResponse(200, order);
    }

    // POST /api/orders - Create order (from cart)
    if (method === 'POST' && !path) {
      const { shippingAddress, paymentMethod } = JSON.parse(event.body);

      if (!shippingAddress || !paymentMethod) {
        return createResponse(400, { error: 'Shipping address and payment method are required' });
      }

      // Get user's cart
      const cart = await Cart.findOne({ userId }).populate('items.productId');
      if (!cart || cart.items.length === 0) {
        return createResponse(400, { error: 'Cart is empty' });
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
        userId,
        items,
        totalAmount,
        shippingAddress,
        paymentMethod,
        status: 'pending',
      });

      await order.save();

      // TODO: Send order confirmation email (implement email service)

      // Clear cart
      cart.items = [];
      cart.updatedAt = Date.now();
      await cart.save();

      return createResponse(201, {
        message: 'Order created successfully',
        order,
        clientSecret: null, // Will be set if Stripe payment
      });
    }

    // PUT /api/orders/:id/status - Update order status (admin only)
    if (method === 'PUT' && path.includes('/status')) {
      const orderId = path.replace('/status', '').replace(/\//g, '');
      const { status } = JSON.parse(event.body);

      const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
      if (!status || !validStatuses.includes(status)) {
        return createResponse(400, { error: 'Invalid status' });
      }

      const order = await Order.findByIdAndUpdate(
        orderId,
        { status, updatedAt: Date.now() },
        { new: true }
      ).populate('items.productId');

      if (!order) {
        return createResponse(404, { error: 'Order not found' });
      }

      return createResponse(200, { message: 'Order status updated', order });
    }

    return createResponse(405, { error: 'Method not allowed' });
  } catch (error) {
    console.error('Orders function error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
