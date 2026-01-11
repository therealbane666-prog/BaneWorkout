// Payments Function - Handles Stripe payment operations
const { connectToDatabase, Order, authenticateToken, createResponse, handleCORS } = require('./utils');

let stripe, stripeClient;
try {
  stripe = require('stripe');
  stripeClient = process.env.STRIPE_SECRET_KEY ? stripe(process.env.STRIPE_SECRET_KEY) : null;
} catch (err) {
  console.log('Stripe module not available');
}

exports.handler = async (event, context) => {
  // Handle CORS
  const corsResponse = handleCORS(event);
  if (corsResponse) return corsResponse;

  try {
    await connectToDatabase();

    const path = event.path.replace('/.netlify/functions/payments', '');
    const method = event.httpMethod;

    // POST /api/payments/create-intent - Create payment intent
    if (method === 'POST' && path === '/create-intent') {
      const authResult = authenticateToken(event.headers.authorization || event.headers.Authorization);
      if (authResult.error) {
        return createResponse(authResult.statusCode, { error: authResult.error });
      }

      if (!stripeClient) {
        return createResponse(503, { error: 'Payment service not configured' });
      }

      const { orderId } = JSON.parse(event.body);

      if (!orderId) {
        return createResponse(400, { error: 'Order ID is required' });
      }

      // Get order
      const order = await Order.findById(orderId);
      if (!order) {
        return createResponse(404, { error: 'Order not found' });
      }

      // Ensure user owns the order
      if (order.userId.toString() !== authResult.user.id) {
        return createResponse(403, { error: 'Access denied' });
      }

      // Create Stripe payment intent
      const paymentIntent = await stripeClient.paymentIntents.create({
        amount: Math.round(order.totalAmount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          orderId: order._id.toString(),
          userId: authResult.user.id,
        },
      });

      // Update order with Stripe payment intent ID
      order.stripePaymentIntentId = paymentIntent.id;
      await order.save();

      return createResponse(200, {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    }

    // POST /api/payments/confirm - Confirm payment
    if (method === 'POST' && path === '/confirm') {
      const authResult = authenticateToken(event.headers.authorization || event.headers.Authorization);
      if (authResult.error) {
        return createResponse(authResult.statusCode, { error: authResult.error });
      }

      if (!stripeClient) {
        return createResponse(503, { error: 'Payment service not configured' });
      }

      const { paymentIntentId } = JSON.parse(event.body);

      if (!paymentIntentId) {
        return createResponse(400, { error: 'Payment Intent ID is required' });
      }

      // Retrieve payment intent from Stripe
      const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        return createResponse(400, { error: 'Payment not completed' });
      }

      // Find and update order
      const order = await Order.findOne({
        stripePaymentIntentId: paymentIntentId,
        userId: authResult.user.id,
      });

      if (!order) {
        return createResponse(404, { error: 'Order not found' });
      }

      order.status = 'paid';
      order.updatedAt = Date.now();
      await order.save();

      return createResponse(200, {
        message: 'Payment confirmed successfully',
        order,
      });
    }

    // POST /api/payments/webhook - Stripe webhook
    if (method === 'POST' && path === '/webhook') {
      if (!stripeClient) {
        return createResponse(503, { error: 'Payment service not configured' });
      }

      const sig = event.headers['stripe-signature'];
      const body = event.body;

      try {
        const stripeEvent = stripeClient.webhooks.constructEvent(
          body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );

        // Handle payment intent succeeded
        if (stripeEvent.type === 'payment_intent.succeeded') {
          const paymentIntent = stripeEvent.data.object;

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
        if (stripeEvent.type === 'payment_intent.payment_failed') {
          const paymentIntent = stripeEvent.data.object;

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

        return createResponse(200, { received: true });
      } catch (error) {
        console.error('Webhook error:', error);
        return createResponse(400, { error: `Webhook Error: ${error.message}` });
      }
    }

    return createResponse(405, { error: 'Method not allowed' });
  } catch (error) {
    console.error('Payments function error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
