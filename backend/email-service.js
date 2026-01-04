// Email Service - Multi-provider support (SendGrid, Mailgun, SMTP)
// Handles order confirmations, weekly reports, and stock alerts

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.provider = process.env.EMAIL_SERVICE || 'none';
    this.from = process.env.EMAIL_FROM || 'noreply@workoutbrothers.com';
    this.enabled = this.provider !== 'none';
    
    if (this.enabled) {
      this.setupTransporter();
    } else {
      console.log('📧 Email service disabled - set EMAIL_SERVICE environment variable to enable');
    }
  }

  setupTransporter() {
    try {
      switch (this.provider.toLowerCase()) {
        case 'sendgrid':
          if (!process.env.SENDGRID_API_KEY) {
            throw new Error('SENDGRID_API_KEY not configured');
          }
          this.transporter = nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            auth: {
              user: 'apikey',
              pass: process.env.SENDGRID_API_KEY,
            },
          });
          console.log('✅ Email service configured: SendGrid');
          break;

        case 'mailgun':
          if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
            throw new Error('MAILGUN_API_KEY or MAILGUN_DOMAIN not configured');
          }
          this.transporter = nodemailer.createTransport({
            host: 'smtp.mailgun.org',
            port: 587,
            auth: {
              user: `postmaster@${process.env.MAILGUN_DOMAIN}`,
              pass: process.env.MAILGUN_API_KEY,
            },
          });
          console.log('✅ Email service configured: Mailgun');
          break;

        case 'smtp':
          if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) {
            throw new Error('SMTP_HOST or SMTP_PORT not configured');
          }
          this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: process.env.SMTP_PORT === '465',
            auth: process.env.SMTP_USER ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            } : undefined,
          });
          console.log('✅ Email service configured: SMTP');
          break;

        default:
          throw new Error(`Unknown email provider: ${this.provider}`);
      }
    } catch (error) {
      console.error('❌ Email service setup failed:', error.message);
      this.enabled = false;
    }
  }

  async sendEmail(to, subject, html, text) {
    if (!this.enabled) {
      console.log(`📧 [DEV MODE] Email would be sent to ${to}:`);
      console.log(`   Subject: ${subject}`);
      console.log(`   Text: ${text || '(HTML only)'}`);
      return { success: true, dev: true };
    }

    try {
      const info = await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        text: text || '',
        html,
      });
      console.log(`✅ Email sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`❌ Failed to send email to ${to}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async sendOrderConfirmation(order, userEmail) {
    const itemsList = order.items
      .map(
        item =>
          `<li>${item.productName} x ${item.quantity} - ${(item.price * item.quantity).toFixed(2)}€</li>`
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: #fff; padding: 20px; text-align: center; }
          .header h1 { margin: 0; color: #ff6b35; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-details { background: #fff; padding: 15px; margin: 15px 0; border-left: 4px solid #4a5f4a; }
          .total { font-size: 1.3em; font-weight: bold; color: #ff6b35; margin-top: 15px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
          ul { padding-left: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💪 WorkoutBrothers</h1>
            <p>Préparation Physique & Mentale</p>
          </div>
          <div class="content">
            <h2>✅ Commande Confirmée</h2>
            <p>Merci pour votre commande! Voici les détails:</p>
            
            <div class="order-details">
              <p><strong>Numéro de commande:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
              <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
              
              <h3>Articles commandés:</h3>
              <ul>${itemsList}</ul>
              
              <p class="total">Total: ${order.totalAmount.toFixed(2)}€</p>
              
              <h3>Adresse de livraison:</h3>
              <p>
                ${order.shippingAddress.street}<br>
                ${order.shippingAddress.zipCode} ${order.shippingAddress.city}<br>
                ${order.shippingAddress.country}
              </p>
            </div>
            
            <p>Votre commande sera traitée dans les plus brefs délais. Vous recevrez un email de confirmation d'expédition.</p>
            <p><strong>Statut actuel:</strong> ${order.status === 'pending' ? 'En attente' : order.status === 'paid' ? 'Payée' : order.status}</p>
          </div>
          <div class="footer">
            <p>WorkoutBrothers - Équipement Tactique, Nutrition & Sport</p>
            <p>Des questions? Contactez-nous à support@workoutbrothers.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
WorkoutBrothers - Commande Confirmée

Numéro de commande: #${order._id.toString().slice(-8).toUpperCase()}
Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}

Articles:
${order.items.map(item => `- ${item.productName} x ${item.quantity} - ${(item.price * item.quantity).toFixed(2)}€`).join('\n')}

Total: ${order.totalAmount.toFixed(2)}€

Merci pour votre commande!
    `;

    return this.sendEmail(
      userEmail,
      `✅ Commande confirmée - WorkoutBrothers #${order._id.toString().slice(-8).toUpperCase()}`,
      html,
      text
    );
  }

  async sendWeeklyReport(stats) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.log('📧 ADMIN_EMAIL not configured - skipping weekly report');
      return { success: false, error: 'No admin email configured' };
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: #fff; padding: 20px; text-align: center; }
          .header h1 { margin: 0; color: #ff6b35; }
          .stat-box { display: inline-block; background: #f9f9f9; padding: 15px 30px; margin: 10px; border-left: 4px solid #4a5f4a; min-width: 150px; }
          .stat-value { font-size: 2em; font-weight: bold; color: #ff6b35; }
          .stat-label { color: #666; font-size: 0.9em; }
          .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Rapport Hebdomadaire</h1>
            <p>WorkoutBrothers - Semaine du ${new Date(stats.weekStart).toLocaleDateString('fr-FR')}</p>
          </div>
          <div style="padding: 20px;">
            <h2>Vue d'ensemble</h2>
            
            <div style="text-align: center;">
              <div class="stat-box">
                <div class="stat-value">${stats.ordersCount}</div>
                <div class="stat-label">Commandes</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${stats.revenue.toFixed(0)}€</div>
                <div class="stat-label">Revenus</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${stats.newUsers}</div>
                <div class="stat-label">Nouveaux clients</div>
              </div>
            </div>
            
            ${stats.lowStockProducts && stats.lowStockProducts.length > 0 ? `
              <div class="alert">
                <h3>⚠️ Alertes Stock</h3>
                <p>Produits avec stock faible:</p>
                <ul>
                  ${stats.lowStockProducts.map(p => `<li>${p.name} - Stock: ${p.stock}</li>`).join('')}
                </ul>
              </div>
            ` : '<p>✅ Tous les stocks sont suffisants</p>'}
            
            <h3>Top 5 Produits</h3>
            <ul>
              ${stats.topProducts ? stats.topProducts.map(p => `<li>${p.name} - ${p.sales} ventes</li>`).join('') : '<li>Aucune vente cette semaine</li>'}
            </ul>
          </div>
          <div class="footer">
            <p>WorkoutBrothers Dashboard</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Rapport Hebdomadaire WorkoutBrothers
Semaine du ${new Date(stats.weekStart).toLocaleDateString('fr-FR')}

Commandes: ${stats.ordersCount}
Revenus: ${stats.revenue.toFixed(2)}€
Nouveaux clients: ${stats.newUsers}

${stats.lowStockProducts && stats.lowStockProducts.length > 0 ? 
  `Alertes stock:\n${stats.lowStockProducts.map(p => `- ${p.name}: ${p.stock}`).join('\n')}` 
  : 'Tous les stocks sont suffisants'}
    `;

    return this.sendEmail(
      adminEmail,
      '📊 Rapport Hebdomadaire WorkoutBrothers',
      html,
      text
    );
  }

  async sendStockAlert(products) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.log('📧 ADMIN_EMAIL not configured - skipping stock alert');
      return { success: false, error: 'No admin email configured' };
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: #fff; padding: 20px; text-align: center; }
          .alert-item { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Alerte Stock Faible</h1>
          </div>
          <div style="padding: 20px;">
            <p>Les produits suivants ont un stock inférieur au seuil d'alerte:</p>
            ${products.map(p => `
              <div class="alert-item">
                <strong>${p.name}</strong><br>
                Stock actuel: <strong style="color: #dc3545;">${p.stock}</strong><br>
                Catégorie: ${p.category}
              </div>
            `).join('')}
            <p>Merci de réapprovisionner ces produits rapidement.</p>
          </div>
          <div class="footer">
            <p>WorkoutBrothers - Système de surveillance automatique</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(
      adminEmail,
      '⚠️ Alerte Stock Faible - WorkoutBrothers',
      html,
      null
    );
  }
}

module.exports = new EmailService();
