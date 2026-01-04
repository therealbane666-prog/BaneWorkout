// Scheduled Jobs - Automatic reports and monitoring
// - Weekly reports (Monday 9:00 AM)
// - Daily stock monitoring (8:00 AM)

const cron = require('node-cron');
const emailService = require('./email-service');

class ScheduledJobs {
  constructor(models) {
    this.Product = models.Product;
    this.Order = models.Order;
    this.User = models.User;
    this.jobs = [];
  }

  start() {
    console.log('🕐 Starting scheduled jobs...');

    // Weekly report - Every Monday at 9:00 AM
    const weeklyReport = cron.schedule('0 9 * * 1', async () => {
      console.log('📊 Running weekly report job...');
      await this.generateWeeklyReport();
    }, {
      timezone: 'Europe/Paris'
    });
    this.jobs.push(weeklyReport);
    console.log('✅ Weekly report scheduled: Every Monday at 9:00 AM');

    // Daily stock check - Every day at 8:00 AM
    const dailyStockCheck = cron.schedule('0 8 * * *', async () => {
      console.log('📦 Running daily stock check...');
      await this.checkLowStock();
    }, {
      timezone: 'Europe/Paris'
    });
    this.jobs.push(dailyStockCheck);
    console.log('✅ Stock monitoring scheduled: Every day at 8:00 AM');

    console.log(`✅ ${this.jobs.length} scheduled jobs started`);
  }

  stop() {
    console.log('🛑 Stopping scheduled jobs...');
    this.jobs.forEach(job => job.stop());
    this.jobs = [];
  }

  async generateWeeklyReport() {
    try {
      // Calculate date range for last week
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - 7);
      weekStart.setHours(0, 0, 0, 0);

      // Get orders from last week
      const orders = await this.Order.find({
        createdAt: { $gte: weekStart }
      }).populate('items.productId');

      // Get new users from last week
      const newUsers = await this.User.countDocuments({
        createdAt: { $gte: weekStart }
      });

      // Calculate revenue
      const revenue = orders.reduce((sum, order) => {
        return sum + (order.status !== 'cancelled' ? order.totalAmount : 0);
      }, 0);

      // Get top products
      const productSales = {};
      orders.forEach(order => {
        if (order.status !== 'cancelled') {
          order.items.forEach(item => {
            const productId = item.productId ? item.productId._id.toString() : item.productName;
            if (!productSales[productId]) {
              productSales[productId] = {
                name: item.productName,
                sales: 0
              };
            }
            productSales[productId].sales += item.quantity;
          });
        }
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

      // Get low stock products
      const lowStockProducts = await this.Product.find({
        stock: { $lt: 10, $gt: 0 }
      }).select('name stock category');

      const stats = {
        weekStart: weekStart,
        ordersCount: orders.length,
        revenue: revenue,
        newUsers: newUsers,
        topProducts: topProducts,
        lowStockProducts: lowStockProducts
      };

      console.log('📊 Weekly stats:', {
        orders: stats.ordersCount,
        revenue: `${stats.revenue.toFixed(2)}€`,
        newUsers: stats.newUsers,
        lowStock: stats.lowStockProducts.length
      });

      // Send report email
      await emailService.sendWeeklyReport(stats);
      
      return stats;
    } catch (error) {
      console.error('❌ Error generating weekly report:', error);
      throw error;
    }
  }

  async checkLowStock() {
    try {
      // Check for products with stock below threshold (10 units)
      // Skip products with unlimited stock (stock >= 999)
      const lowStockProducts = await this.Product.find({
        stock: { $lt: 10, $gt: 0, $lt: 999 }
      }).select('name stock category');

      if (lowStockProducts.length > 0) {
        console.log(`⚠️ Found ${lowStockProducts.length} products with low stock`);
        lowStockProducts.forEach(p => {
          console.log(`  - ${p.name}: ${p.stock} units`);
        });
        
        // Send alert email
        await emailService.sendStockAlert(lowStockProducts);
      } else {
        console.log('✅ All stock levels are sufficient');
      }

      return lowStockProducts;
    } catch (error) {
      console.error('❌ Error checking stock levels:', error);
      throw error;
    }
  }

  // Manual trigger methods for testing
  async triggerWeeklyReport() {
    console.log('🔧 Manually triggering weekly report...');
    return this.generateWeeklyReport();
  }

  async triggerStockCheck() {
    console.log('🔧 Manually triggering stock check...');
    return this.checkLowStock();
  }
}

module.exports = ScheduledJobs;
