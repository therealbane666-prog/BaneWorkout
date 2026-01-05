// WorkoutBrothers Scheduled Jobs
// Automated tasks for inventory, reports, notifications, and pricing

const cron = require('node-cron');

/**
 * Initialize and start all scheduled jobs
 * @param {Object} dependencies - Required dependencies (models, services, aiAgent)
 */
function initializeScheduledJobs(dependencies = {}) {
  const { Product, Order, User, aiAgent, emailService } = dependencies;

  console.log('📅 Initializing scheduled jobs...');

  // ============================================================================
  // DAILY JOBS
  // ============================================================================

  // Stock Surveillance - Every day at 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('📦 [CRON] Running daily stock check...');
    
    try {
      if (!Product) {
        console.log('⚠️  Product model not available');
        return;
      }

      // Find low stock products (less than 10 units)
      const lowStockProducts = await Product.find({ stock: { $lt: 10 } });
      
      if (lowStockProducts.length > 0) {
        console.log(`⚠️  Found ${lowStockProducts.length} low stock products`);
        
        // Auto-reorder if AI agent is available
        if (aiAgent) {
          const reorderResult = await aiAgent.autoReorderStock(lowStockProducts);
          console.log(`✅ Auto-reorder: ${reorderResult.reorders?.length || 0} orders created`);
        }
        
        // Send email alert if email service is available
        if (emailService) {
          await emailService.sendLowStockAlert({
            products: lowStockProducts,
            count: lowStockProducts.length
          });
        }
      } else {
        console.log('✅ All products have sufficient stock');
      }
    } catch (error) {
      console.error('❌ Error in stock check job:', error);
    }
  }, {
    scheduled: true,
    timezone: "Europe/Paris"
  });

  // Pricing Optimization - Every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('💰 [CRON] Running daily pricing optimization...');
    
    try {
      if (!Product || !aiAgent) {
        console.log('⚠️  Product model or AI agent not available');
        return;
      }

      const products = await Product.find({});
      const optimizationResult = await aiAgent.optimizeAllPricing(products);
      
      if (optimizationResult.success) {
        console.log(`✅ Optimized ${optimizationResult.totalOptimized} product prices`);
        
        // Update products with optimized prices (if desired)
        // This is commented out to avoid automatic price changes without review
        /*
        for (const opt of optimizationResult.optimizations) {
          await Product.findByIdAndUpdate(opt.productId, {
            price: opt.optimizedPrice,
            updatedAt: Date.now()
          });
        }
        */
      }
    } catch (error) {
      console.error('❌ Error in pricing optimization job:', error);
    }
  }, {
    scheduled: true,
    timezone: "Europe/Paris"
  });

  // Personalized Notifications - Every day at 10:00 AM
  cron.schedule('0 10 * * *', async () => {
    console.log('🔔 [CRON] Sending personalized notifications...');
    
    try {
      if (!User || !aiAgent) {
        console.log('⚠️  User model or AI agent not available');
        return;
      }

      // Get users who haven't ordered recently
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const inactiveUsers = await User.find({
        lastOrder: { $lt: thirtyDaysAgo }
      }).limit(100);
      
      if (inactiveUsers.length > 0) {
        const notificationResult = await aiAgent.sendPersonalizedNotifications(inactiveUsers);
        console.log(`✅ Sent ${notificationResult.notificationsSent} notifications`);
      }
    } catch (error) {
      console.error('❌ Error in notification job:', error);
    }
  }, {
    scheduled: true,
    timezone: "Europe/Paris"
  });

  // Database Cleanup - Every day at 2:00 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('🧹 [CRON] Running database cleanup...');
    
    try {
      if (!Order) {
        console.log('⚠️  Order model not available');
        return;
      }

      // Delete abandoned carts older than 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      // Clean up old pending orders (optional - commented out for safety)
      /*
      const deleteResult = await Order.deleteMany({
        status: 'pending',
        createdAt: { $lt: thirtyDaysAgo }
      });
      console.log(`✅ Cleaned up ${deleteResult.deletedCount} old pending orders`);
      */
      
      console.log('✅ Database cleanup completed');
    } catch (error) {
      console.error('❌ Error in cleanup job:', error);
    }
  }, {
    scheduled: true,
    timezone: "Europe/Paris"
  });

  // ============================================================================
  // WEEKLY JOBS
  // ============================================================================

  // Weekly Report - Every Monday at 9:00 AM
  cron.schedule('0 9 * * 1', async () => {
    console.log('📧 [CRON] Generating weekly report...');
    
    try {
      if (!Order || !Product || !User) {
        console.log('⚠️  Required models not available');
        return;
      }

      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      // Generate weekly report
      const weeklyReport = {
        period: {
          start: weekAgo,
          end: new Date()
        },
        totalOrders: await Order.countDocuments({
          createdAt: { $gte: weekAgo }
        }),
        totalRevenue: await Order.aggregate([
          { $match: { createdAt: { $gte: weekAgo }, status: 'paid' } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]).then(result => result[0]?.total || 0),
        newUsers: await User.countDocuments({
          createdAt: { $gte: weekAgo }
        }),
        topProducts: await Order.aggregate([
          { $match: { createdAt: { $gte: weekAgo } } },
          { $unwind: '$items' },
          { $group: { 
            _id: '$items.productId',
            totalSold: { $sum: '$items.quantity' },
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
          }},
          { $sort: { totalSold: -1 } },
          { $limit: 10 }
        ])
      };

      console.log('📊 Weekly Report:');
      console.log(`   Orders: ${weeklyReport.totalOrders}`);
      console.log(`   Revenue: €${weeklyReport.totalRevenue.toFixed(2)}`);
      console.log(`   New Users: ${weeklyReport.newUsers}`);

      // Get AI insights if available
      if (aiAgent) {
        const insights = await aiAgent.analyzeWeeklyPerformance(weeklyReport);
        console.log('🤖 AI Analysis:', insights.analysis?.summary);
        
        // Send email report if email service is available
        if (emailService) {
          await emailService.sendWeeklyReport({
            report: weeklyReport,
            insights: insights.analysis
          });
        }
      }
    } catch (error) {
      console.error('❌ Error in weekly report job:', error);
    }
  }, {
    scheduled: true,
    timezone: "Europe/Paris"
  });

  // Weekly Inventory Analysis - Every Sunday at 8:00 PM
  cron.schedule('0 20 * * 0', async () => {
    console.log('📊 [CRON] Running weekly inventory analysis...');
    
    try {
      if (!Product || !aiAgent) {
        console.log('⚠️  Product model or AI agent not available');
        return;
      }

      const products = await Product.find({});
      const salesData = []; // Would need to be populated from actual sales data
      
      const inventoryReport = await aiAgent.manageInventory(products, salesData);
      
      console.log('📦 Inventory Analysis:');
      console.log(`   Total Alerts: ${inventoryReport.summary?.totalAlerts || 0}`);
      console.log(`   Critical: ${inventoryReport.summary?.criticalAlerts || 0}`);
      console.log(`   Reorder Cost: €${inventoryReport.summary?.estimatedReorderCost?.toFixed(2) || 0}`);
    } catch (error) {
      console.error('❌ Error in inventory analysis job:', error);
    }
  }, {
    scheduled: true,
    timezone: "Europe/Paris"
  });

  // ============================================================================
  // MONTHLY JOBS
  // ============================================================================

  // Monthly Performance Report - 1st of every month at 9:00 AM
  cron.schedule('0 9 1 * *', async () => {
    console.log('📊 [CRON] Generating monthly performance report...');
    
    try {
      if (!Order || !Product || !User) {
        console.log('⚠️  Required models not available');
        return;
      }

      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const monthlyReport = {
        period: 'Last 30 days',
        totalOrders: await Order.countDocuments({
          createdAt: { $gte: monthAgo }
        }),
        totalRevenue: await Order.aggregate([
          { $match: { createdAt: { $gte: monthAgo }, status: 'paid' } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]).then(result => result[0]?.total || 0),
        avgOrderValue: await Order.aggregate([
          { $match: { createdAt: { $gte: monthAgo }, status: 'paid' } },
          { $group: { _id: null, avg: { $avg: '$totalAmount' } } }
        ]).then(result => result[0]?.avg || 0),
        newUsers: await User.countDocuments({
          createdAt: { $gte: monthAgo }
        }),
        totalProducts: await Product.countDocuments(),
        lowStockCount: await Product.countDocuments({ stock: { $lt: 10 } })
      };

      console.log('📈 Monthly Performance Report:');
      console.log(`   Orders: ${monthlyReport.totalOrders}`);
      console.log(`   Revenue: €${monthlyReport.totalRevenue.toFixed(2)}`);
      console.log(`   Avg Order: €${monthlyReport.avgOrderValue.toFixed(2)}`);
      console.log(`   New Users: ${monthlyReport.newUsers}`);

      // Get AI insights
      if (aiAgent) {
        const orders = await Order.find({ createdAt: { $gte: monthAgo } });
        const salesData = orders.map(order => ({
          total: order.totalAmount,
          date: order.createdAt,
          items: order.items.length
        }));
        
        const insights = await aiAgent.generateInsights(salesData, '30d');
        console.log('🤖 AI Insights:', insights.insights?.summary);
      }
    } catch (error) {
      console.error('❌ Error in monthly report job:', error);
    }
  }, {
    scheduled: true,
    timezone: "Europe/Paris"
  });

  // ============================================================================
  // HOURLY JOBS
  // ============================================================================

  // System Health Check - Every hour
  cron.schedule('0 * * * *', async () => {
    console.log('💓 [CRON] Running system health check...');
    
    try {
      const mongoose = require('mongoose');
      
      const health = {
        timestamp: new Date(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        uptime: process.uptime(),
        memory: process.memoryUsage()
      };

      console.log('✅ System Health:', {
        database: health.database,
        uptime: `${Math.floor(health.uptime / 3600)}h ${Math.floor((health.uptime % 3600) / 60)}m`,
        memory: `${Math.round(health.memory.heapUsed / 1024 / 1024)}MB / ${Math.round(health.memory.heapTotal / 1024 / 1024)}MB`
      });
    } catch (error) {
      console.error('❌ Error in health check:', error);
    }
  }, {
    scheduled: true,
    timezone: "Europe/Paris"
  });

  console.log('✅ All scheduled jobs initialized');
  console.log('📅 Active schedules:');
  console.log('   - Stock check: Daily at 8:00 AM');
  console.log('   - Pricing optimization: Daily at midnight');
  console.log('   - Notifications: Daily at 10:00 AM');
  console.log('   - Database cleanup: Daily at 2:00 AM');
  console.log('   - Weekly report: Monday at 9:00 AM');
  console.log('   - Inventory analysis: Sunday at 8:00 PM');
  console.log('   - Monthly report: 1st of month at 9:00 AM');
  console.log('   - Health check: Every hour');
}

/**
 * Stop all scheduled jobs
 */
function stopScheduledJobs() {
  console.log('⏹️  Stopping all scheduled jobs...');
  cron.getTasks().forEach(task => task.stop());
  console.log('✅ All scheduled jobs stopped');
}

module.exports = {
  initializeScheduledJobs,
  stopScheduledJobs
};
