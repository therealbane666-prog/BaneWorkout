// WorkoutBrothers - Scheduled Jobs
// Automated tasks including weekly reports and stock monitoring

const cron = require('node-cron');
const { sendWeeklyReport } = require('./email-service');

// Initialize scheduled jobs
function initializeJobs(models) {
  const { Order, Product, User } = models;

  // Weekly report - Every Monday at 9:00 AM
  cron.schedule('0 9 * * 1', async () => {
    console.log('📊 Generating weekly report...');

    try {
      const stats = await generateWeeklyStats(Order, Product, User);
      await sendWeeklyReport(stats);
      console.log('✅ Weekly report sent successfully');
    } catch (error) {
      console.error('❌ Error generating weekly report:', error);
    }
  });

  // Daily low stock alert - Every day at 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('📦 Checking stock levels...');

    try {
      const lowStockProducts = await Product.find({ stock: { $lt: 10 } });
      
      if (lowStockProducts.length > 0) {
        console.log(`⚠️  ${lowStockProducts.length} products with low stock:`);
        lowStockProducts.forEach(p => {
          console.log(`  - ${p.name}: ${p.stock} remaining`);
        });
      } else {
        console.log('✅ All products have sufficient stock');
      }
    } catch (error) {
      console.error('❌ Error checking stock:', error);
    }
  });

  console.log('✅ Scheduled jobs initialized');
}

// Generate weekly statistics
async function generateWeeklyStats(Order, Product, User) {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Get orders from the last week
  const weeklyOrders = await Order.find({
    createdAt: { $gte: oneWeekAgo, $lte: now },
  }).populate('items.productId');

  // Calculate total revenue
  const totalRevenue = weeklyOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  // Count new customers
  const newCustomers = await User.countDocuments({
    createdAt: { $gte: oneWeekAgo, $lte: now },
  });

  // Calculate average order value
  const averageOrderValue = weeklyOrders.length > 0 ? totalRevenue / weeklyOrders.length : 0;

  // Get top products
  const productSales = {};
  weeklyOrders.forEach(order => {
    order.items.forEach(item => {
      const productId = item.productId?._id?.toString() || item.productId?.toString();
      if (!productSales[productId]) {
        productSales[productId] = {
          name: item.productName,
          sales: 0,
        };
      }
      productSales[productId].sales += item.quantity;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  // Get orders by status
  const ordersByStatus = {};
  weeklyOrders.forEach(order => {
    ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
  });

  // Get top categories
  const categoryStats = {};
  weeklyOrders.forEach(order => {
    order.items.forEach(item => {
      const product = item.productId;
      if (product && product.category) {
        if (!categoryStats[product.category]) {
          categoryStats[product.category] = {
            category: product.category,
            revenue: 0,
            orders: 0,
          };
        }
        categoryStats[product.category].revenue += item.price * item.quantity;
        categoryStats[product.category].orders += 1;
      }
    });
  });

  const topCategories = Object.values(categoryStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);

  // Get low stock products
  const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
    .select('name stock')
    .limit(10);

  return {
    periodStart: oneWeekAgo,
    periodEnd: now,
    totalRevenue,
    totalOrders: weeklyOrders.length,
    newCustomers,
    averageOrderValue,
    topProducts,
    ordersByStatus,
    topCategories,
    lowStockProducts,
  };
}

module.exports = {
  initializeJobs,
  generateWeeklyStats,
};
