// Cart Function - Handles all shopping cart operations
const { connectToDatabase, Cart, Product, authenticateToken, createResponse, handleCORS } = require('./utils');

exports.handler = async (event, context) => {
  // Handle CORS
  const corsResponse = handleCORS(event);
  if (corsResponse) return corsResponse;

  // All cart operations require authentication
  const authResult = authenticateToken(event.headers.authorization || event.headers.Authorization);
  if (authResult.error) {
    return createResponse(authResult.statusCode, { error: authResult.error });
  }

  try {
    await connectToDatabase();

    const path = event.path.replace('/.netlify/functions/cart', '');
    const method = event.httpMethod;
    const userId = authResult.user.id;

    // GET /api/cart - Get user's cart
    if (method === 'GET' && !path) {
      let cart = await Cart.findOne({ userId }).populate('items.productId');

      if (!cart) {
        cart = new Cart({ userId, items: [] });
        await cart.save();
      }

      // Calculate total price
      const total = cart.items.reduce((sum, item) => {
        return sum + (item.productId?.price || 0) * item.quantity;
      }, 0);

      return createResponse(200, { cart, total: total.toFixed(2) });
    }

    // POST /api/cart/items - Add item to cart
    if (method === 'POST' && path === '/items') {
      const { productId, quantity } = JSON.parse(event.body);

      if (!productId || !quantity || quantity < 1) {
        return createResponse(400, { error: 'Invalid product or quantity' });
      }

      // Verify product exists
      const product = await Product.findById(productId);
      if (!product) {
        return createResponse(404, { error: 'Product not found' });
      }

      if (product.stock < quantity) {
        return createResponse(400, { error: 'Insufficient stock' });
      }

      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [] });
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
        return sum + (item.productId?.price || 0) * item.quantity;
      }, 0);

      return createResponse(201, { message: 'Item added to cart', cart, total: total.toFixed(2) });
    }

    // PUT /api/cart/items/:itemId - Update cart item quantity
    if (method === 'PUT' && path.startsWith('/items/')) {
      const itemId = path.replace('/items/', '');
      const { quantity } = JSON.parse(event.body);

      if (!quantity || quantity < 1) {
        return createResponse(400, { error: 'Invalid quantity' });
      }

      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return createResponse(404, { error: 'Cart not found' });
      }

      const cartItem = cart.items.id(itemId);
      if (!cartItem) {
        return createResponse(404, { error: 'Cart item not found' });
      }

      cartItem.quantity = quantity;
      cart.updatedAt = Date.now();
      await cart.save();
      await cart.populate('items.productId');

      const total = cart.items.reduce((sum, item) => {
        return sum + (item.productId?.price || 0) * item.quantity;
      }, 0);

      return createResponse(200, { message: 'Cart item updated', cart, total: total.toFixed(2) });
    }

    // DELETE /api/cart/items/:itemId - Remove item from cart
    if (method === 'DELETE' && path.startsWith('/items/')) {
      const itemId = path.replace('/items/', '');
      
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return createResponse(404, { error: 'Cart not found' });
      }

      const cartItem = cart.items.id(itemId);
      if (!cartItem) {
        return createResponse(404, { error: 'Cart item not found' });
      }

      cartItem.deleteOne();
      cart.updatedAt = Date.now();
      await cart.save();
      await cart.populate('items.productId');

      const total = cart.items.reduce((sum, item) => {
        return sum + (item.productId?.price || 0) * item.quantity;
      }, 0);

      return createResponse(200, { message: 'Item removed from cart', cart, total: total.toFixed(2) });
    }

    // DELETE /api/cart - Clear cart
    if (method === 'DELETE' && !path) {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return createResponse(404, { error: 'Cart not found' });
      }

      cart.items = [];
      cart.updatedAt = Date.now();
      await cart.save();

      return createResponse(200, { message: 'Cart cleared', cart });
    }

    return createResponse(405, { error: 'Method not allowed' });
  } catch (error) {
    console.error('Cart function error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
