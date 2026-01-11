// Admin Function - Handles admin dashboard and operations
const { connectToDatabase, Product, User, Order, authenticateToken, createResponse, handleCORS } = require('./utils');

exports.handler = async (event, context) => {
  // Handle CORS
  const corsResponse = handleCORS(event);
  if (corsResponse) return corsResponse;

  // All admin operations require authentication
  const authResult = authenticateToken(event.headers.authorization || event.headers.Authorization);
  if (authResult.error) {
    return createResponse(authResult.statusCode, { error: authResult.error });
  }

  try {
    await connectToDatabase();

    const path = event.path.replace('/.netlify/functions/admin', '');
    const method = event.httpMethod;

    // GET /api/admin/stats - Get dashboard statistics
    if (method === 'GET' && path === '/stats') {
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

      return createResponse(200, {
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
    }

    // POST /api/admin/trigger-report - Trigger weekly report (placeholder)
    if (method === 'POST' && path === '/trigger-report') {
      // TODO: Implement scheduled jobs for Netlify (use Netlify Scheduled Functions or external service)
      return createResponse(200, { 
        message: 'Weekly report generation not yet implemented for Netlify Functions',
        note: 'Consider using Netlify Scheduled Functions or external cron service'
      });
    }

    // POST /api/admin/trigger-stock-check - Trigger stock check (placeholder)
    if (method === 'POST' && path === '/trigger-stock-check') {
      const lowStockProducts = await Product.find({
        stock: { $lt: 10, $gt: 0 },
        $nor: [{ stock: { $gte: 999 } }]
      }).select('name stock category');

      return createResponse(200, { 
        message: 'Stock check completed',
        lowStockCount: lowStockProducts.length,
        products: lowStockProducts
      });
    }

    return createResponse(405, { error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin function error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
