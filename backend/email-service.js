// WorkoutBrothers - Email Service
// Handles automated email notifications and weekly reports

const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  // Support multiple email providers
  if (process.env.SENDGRID_API_KEY) {
    // SendGrid configuration
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  } else if (process.env.MAILGUN_API_KEY) {
    // Mailgun configuration
    return nodemailer.createTransport({
      host: process.env.MAILGUN_SMTP_HOST || 'smtp.mailgun.org',
      port: 587,
      auth: {
        user: process.env.MAILGUN_SMTP_USER,
        pass: process.env.MAILGUN_API_KEY,
      },
    });
  } else if (process.env.SMTP_HOST) {
    // Generic SMTP configuration
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  // Development mode - log emails to console
  console.warn('⚠️  No email service configured. Emails will be logged to console.');
  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true,
  });
};

// Send email helper
async function sendEmail({ to, subject, html, text }) {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'WorkoutBrothers <noreply@workoutbrothers.com>',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    const info = await transporter.sendMail(mailOptions);

    // Log in development mode
    if (info.message) {
      console.log('📧 Email (dev mode):', info.message.toString());
    } else {
      console.log('📧 Email sent:', info.messageId);
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
}

// Send order confirmation email
async function sendOrderConfirmation(order, user) {
  const itemsList = order.items
    .map(
      (item) =>
        `<li>${item.productName} x${item.quantity} - ${item.price.toFixed(2)}€</li>`
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .total { font-size: 1.2em; font-weight: bold; color: #667eea; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💪 WorkoutBrothers</h1>
          <p>Confirmation de commande</p>
        </div>
        <div class="content">
          <h2>Merci ${user.username} !</h2>
          <p>Votre commande a été confirmée et sera traitée dans les plus brefs délais.</p>
          
          <div class="order-details">
            <h3>Détails de la commande #${order._id}</h3>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
            <p><strong>Statut:</strong> ${order.status}</p>
            
            <h4>Articles commandés:</h4>
            <ul>${itemsList}</ul>
            
            <div class="total">
              Total: ${order.totalAmount.toFixed(2)}€
            </div>
          </div>
          
          <p>Vous recevrez un email de suivi dès que votre commande sera expédiée.</p>
          
          <p><strong>Besoin d'aide ?</strong> Répondez à cet email ou contactez notre support.</p>
        </div>
        <div class="footer">
          <p>WorkoutBrothers - Préparation Physique & Mentale</p>
          <p>© 2026 WorkoutBrothers. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: `WorkoutBrothers - Commande #${order._id} confirmée`,
    html,
  });
}

// Send weekly business report
async function sendWeeklyReport(stats) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
        .stat-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
        .stat-value { font-size: 2em; font-weight: bold; color: #667eea; }
        .stat-label { color: #666; margin-top: 10px; }
        .section { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .product-list { list-style: none; padding: 0; }
        .product-list li { padding: 10px; background: white; margin: 5px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💪 WorkoutBrothers</h1>
          <h2>Rapport Hebdomadaire</h2>
          <p>${new Date(stats.periodStart).toLocaleDateString('fr-FR')} - ${new Date(stats.periodEnd).toLocaleDateString('fr-FR')}</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${stats.totalRevenue.toFixed(2)}€</div>
            <div class="stat-label">Chiffre d'affaires</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.totalOrders}</div>
            <div class="stat-label">Commandes</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.newCustomers}</div>
            <div class="stat-label">Nouveaux clients</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.averageOrderValue.toFixed(2)}€</div>
            <div class="stat-label">Panier moyen</div>
          </div>
        </div>
        
        <div class="section">
          <h3>📊 Produits les plus vendus</h3>
          <ul class="product-list">
            ${stats.topProducts.map(p => `<li><strong>${p.name}</strong> - ${p.sales} ventes</li>`).join('')}
          </ul>
        </div>
        
        <div class="section">
          <h3>📦 Statut des commandes</h3>
          <ul>
            <li>En attente: ${stats.ordersByStatus.pending || 0}</li>
            <li>Payées: ${stats.ordersByStatus.paid || 0}</li>
            <li>Expédiées: ${stats.ordersByStatus.shipped || 0}</li>
            <li>Livrées: ${stats.ordersByStatus.delivered || 0}</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>📈 Catégories populaires</h3>
          <ul>
            ${stats.topCategories.map(c => `<li><strong>${c.category}</strong>: ${c.revenue.toFixed(2)}€ (${c.orders} commandes)</li>`).join('')}
          </ul>
        </div>
        
        <div class="section">
          <h3>⚠️ Alertes stock</h3>
          ${stats.lowStockProducts.length > 0 
            ? `<ul class="product-list">${stats.lowStockProducts.map(p => `<li>${p.name} - Stock restant: ${p.stock}</li>`).join('')}</ul>`
            : '<p>✅ Tous les produits ont un stock suffisant.</p>'
          }
        </div>
        
        <div class="footer">
          <p>WorkoutBrothers - Tableau de bord automatique</p>
          <p>© 2026 WorkoutBrothers. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;
  
  return sendEmail({
    to: adminEmail,
    subject: `📊 WorkoutBrothers - Rapport hebdomadaire (Semaine du ${new Date(stats.periodStart).toLocaleDateString('fr-FR')})`,
    html,
  });
}

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendWeeklyReport,
};
