// Products Function - Handles all product-related operations
const { connectToDatabase, Product, authenticateToken, createResponse, handleCORS } = require('./utils');

exports.handler = async (event, context) => {
  // Handle CORS
  const corsResponse = handleCORS(event);
  if (corsResponse) return corsResponse;

  try {
    await connectToDatabase();

    const path = event.path.replace('/.netlify/functions/products', '');
    const method = event.httpMethod;
    const queryParams = event.queryStringParameters || {};

    // GET /api/products - List all products
    if (method === 'GET' && !path) {
      const { category, search, sortBy, page = 1, limit = 10 } = queryParams;
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

      return createResponse(200, {
        products,
        pagination: {
          total,
          pages: Math.ceil(total / limitNum),
          currentPage: pageNum,
          limit: limitNum,
        },
      });
    }

    // GET /api/products/:id - Get single product
    if (method === 'GET' && path) {
      const productId = path.replace('/', '');
      const product = await Product.findById(productId);

      if (!product) {
        return createResponse(404, { error: 'Product not found' });
      }

      return createResponse(200, product);
    }

    // POST /api/products - Create product (authenticated)
    if (method === 'POST' && !path) {
      const authResult = authenticateToken(event.headers.authorization || event.headers.Authorization);
      if (authResult.error) {
        return createResponse(authResult.statusCode, { error: authResult.error });
      }

      const { name, description, price, category, stock, image } = JSON.parse(event.body);

      if (!name || !description || !price || !category) {
        return createResponse(400, { error: 'Required fields are missing' });
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
      return createResponse(201, { message: 'Product created successfully', product });
    }

    // PUT /api/products/:id - Update product (authenticated)
    if (method === 'PUT' && path) {
      const authResult = authenticateToken(event.headers.authorization || event.headers.Authorization);
      if (authResult.error) {
        return createResponse(authResult.statusCode, { error: authResult.error });
      }

      const productId = path.replace('/', '');
      const { name, description, price, category, stock, image } = JSON.parse(event.body);

      const product = await Product.findByIdAndUpdate(
        productId,
        { name, description, price, category, stock, image, updatedAt: Date.now() },
        { new: true }
      );

      if (!product) {
        return createResponse(404, { error: 'Product not found' });
      }

      return createResponse(200, { message: 'Product updated successfully', product });
    }

    // DELETE /api/products/:id - Delete product (authenticated)
    if (method === 'DELETE' && path) {
      const authResult = authenticateToken(event.headers.authorization || event.headers.Authorization);
      if (authResult.error) {
        return createResponse(authResult.statusCode, { error: authResult.error });
      }

      const productId = path.replace('/', '');
      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return createResponse(404, { error: 'Product not found' });
      }

      return createResponse(200, { message: 'Product deleted successfully' });
    }

    // POST /api/products/:id/reviews - Add review (authenticated)
    if (method === 'POST' && path.includes('/reviews')) {
      const authResult = authenticateToken(event.headers.authorization || event.headers.Authorization);
      if (authResult.error) {
        return createResponse(authResult.statusCode, { error: authResult.error });
      }

      const productId = path.replace('/reviews', '').replace(/\//g, '');
      const { rating, comment } = JSON.parse(event.body);

      if (!rating || rating < 1 || rating > 5) {
        return createResponse(400, { error: 'Rating must be between 1 and 5' });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return createResponse(404, { error: 'Product not found' });
      }

      const review = {
        userId: authResult.user.id,
        username: authResult.user.username,
        rating,
        comment,
      };

      product.reviews.push(review);

      // Calculate average rating
      const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = (totalRating / product.reviews.length).toFixed(2);

      await product.save();

      return createResponse(201, { message: 'Review added successfully', product });
    }

    return createResponse(405, { error: 'Method not allowed' });
  } catch (error) {
    console.error('Products function error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
