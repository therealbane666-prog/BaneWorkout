/**
 * SendGrid Email Configuration and Functions
 * Handles all email operations for the BaneWorkout application
 * @file backend/config/email.js
 * @version 1.0.0
 */

const sgMail = require('@sendgrid/mail');

/**
 * Initialize SendGrid with API key
 * Must be called once at application startup
 */
const initializeEmail = () => {
  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    throw new Error('SENDGRID_API_KEY environment variable is not set');
  }
  
  sgMail.setApiKey(apiKey);
  console.log('✓ SendGrid email service initialized successfully');
};

/**
 * Send a single email
 * @param {Object} mailOptions - Email configuration
 * @param {string} mailOptions.to - Recipient email address
 * @param {string} mailOptions.from - Sender email address (defaults to SENDGRID_FROM_EMAIL)
 * @param {string} mailOptions.subject - Email subject
 * @param {string} mailOptions.text - Plain text email body
 * @param {string} mailOptions.html - HTML email body (optional)
 * @param {Array} mailOptions.attachments - Email attachments (optional)
 * @returns {Promise<Array>} SendGrid response
 */
const sendEmail = async (mailOptions) => {
  try {
    const {
      to,
      from = process.env.SENDGRID_FROM_EMAIL,
      subject,
      text,
      html,
      attachments
    } = mailOptions;

    if (!to || !subject || (!text && !html)) {
      throw new Error('Missing required email fields: to, subject, and either text or html');
    }

    const msg = {
      to,
      from,
      subject,
      text,
      ...(html && { html }),
      ...(attachments && { attachments })
    };

    const result = await sgMail.send(msg);
    console.log(`✓ Email sent successfully to ${to}`);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send bulk emails to multiple recipients
 * @param {Object} bulkOptions - Bulk email configuration
 * @param {Array<string>} bulkOptions.recipients - Array of recipient email addresses
 * @param {string} bulkOptions.from - Sender email address (defaults to SENDGRID_FROM_EMAIL)
 * @param {string} bulkOptions.subject - Email subject
 * @param {string} bulkOptions.text - Plain text email body
 * @param {string} bulkOptions.html - HTML email body (optional)
 * @param {Array} bulkOptions.attachments - Email attachments (optional)
 * @returns {Promise<Array>} Array of SendGrid responses
 */
const sendBulkEmails = async (bulkOptions) => {
  try {
    const {
      recipients,
      from = process.env.SENDGRID_FROM_EMAIL,
      subject,
      text,
      html,
      attachments
    } = bulkOptions;

    if (!recipients || recipients.length === 0) {
      throw new Error('No recipients provided for bulk email');
    }

    if (!subject || (!text && !html)) {
      throw new Error('Missing required email fields: subject, and either text or html');
    }

    const results = [];

    // Send to each recipient
    for (const recipient of recipients) {
      const msg = {
        to: recipient,
        from,
        subject,
        text,
        ...(html && { html }),
        ...(attachments && { attachments })
      };

      try {
        const result = await sgMail.send(msg);
        results.push({
          recipient,
          status: 'sent',
          result
        });
        console.log(`✓ Bulk email sent to ${recipient}`);
      } catch (recipientError) {
        results.push({
          recipient,
          status: 'failed',
          error: recipientError.message
        });
        console.error(`✗ Failed to send bulk email to ${recipient}:`, recipientError.message);
      }
    }

    return results;
  } catch (error) {
    console.error('Error in bulk email operation:', error);
    throw new Error(`Bulk email operation failed: ${error.message}`);
  }
};

/**
 * Send program confirmation email
 * @param {Object} confirmationData - Program confirmation details
 * @param {string} confirmationData.userEmail - User's email address
 * @param {string} confirmationData.userName - User's full name
 * @param {string} confirmationData.programName - Name of the workout program
 * @param {string} confirmationData.programType - Type of program (e.g., 'Strength', 'Cardio')
 * @param {number} confirmationData.duration - Program duration in weeks
 * @param {string} confirmationData.startDate - Program start date (YYYY-MM-DD)
 * @param {string} confirmationData.confirmationLink - Link to confirm enrollment
 * @returns {Promise<Array>} SendGrid response
 */
const sendProgramConfirmationEmail = async (confirmationData) => {
  try {
    const {
      userEmail,
      userName,
      programName,
      programType,
      duration,
      startDate,
      confirmationLink
    } = confirmationData;

    if (!userEmail || !userName || !programName || !confirmationLink) {
      throw new Error('Missing required confirmation data: userEmail, userName, programName, confirmationLink');
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #1f77bc;
              padding-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              color: #1f77bc;
              font-size: 28px;
            }
            .content {
              margin: 20px 0;
            }
            .content p {
              margin: 10px 0;
            }
            .program-details {
              background-color: #f9f9f9;
              padding: 20px;
              border-left: 4px solid #1f77bc;
              margin: 20px 0;
              border-radius: 4px;
            }
            .program-details h3 {
              margin-top: 0;
              color: #1f77bc;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .detail-label {
              font-weight: 600;
              color: #555;
            }
            .detail-value {
              color: #333;
            }
            .cta-button {
              display: inline-block;
              background-color: #1f77bc;
              color: #ffffff;
              padding: 14px 32px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
              text-align: center;
            }
            .cta-button:hover {
              background-color: #1a5f94;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #999;
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffc107;
              padding: 12px;
              border-radius: 4px;
              color: #856404;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏋️ Program Enrollment Confirmation</h1>
            </div>

            <div class="content">
              <p>Hello <strong>${userName}</strong>,</p>

              <p>Thank you for enrolling in our workout program! We're excited to help you achieve your fitness goals.</p>

              <div class="program-details">
                <h3>Program Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Program:</span>
                  <span class="detail-value">${programName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Type:</span>
                  <span class="detail-value">${programType}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Duration:</span>
                  <span class="detail-value">${duration} weeks</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Start Date:</span>
                  <span class="detail-value">${startDate}</span>
                </div>
              </div>

              <p>To complete your enrollment and get started with your training, please click the button below:</p>

              <div style="text-align: center;">
                <a href="${confirmationLink}" class="cta-button">Confirm Enrollment</a>
              </div>

              <div class="warning">
                <strong>⚠️ Important:</strong> This confirmation link is valid for 24 hours. If you didn't request this enrollment, please ignore this email.
              </div>

              <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>

              <p>Best regards,<br>The BaneWorkout Team</p>
            </div>

            <div class="footer">
              <p>&copy; 2026 BaneWorkout. All rights reserved.</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const plainText = `
Program Enrollment Confirmation

Hello ${userName},

Thank you for enrolling in our workout program! We're excited to help you achieve your fitness goals.

Program Details:
- Program: ${programName}
- Type: ${programType}
- Duration: ${duration} weeks
- Start Date: ${startDate}

To complete your enrollment and get started with your training, please visit the link below:
${confirmationLink}

This confirmation link is valid for 24 hours. If you didn't request this enrollment, please ignore this email.

If you have any questions or need assistance, please reach out to our support team.

Best regards,
The BaneWorkout Team
    `;

    return await sendEmail({
      to: userEmail,
      subject: `Confirm Your ${programName} Program Enrollment`,
      text: plainText,
      html: htmlContent
    });
  } catch (error) {
    console.error('Error sending program confirmation email:', error);
    throw new Error(`Failed to send program confirmation email: ${error.message}`);
  }
};

/**
 * Send promotional email
 * @param {Object} promoData - Promotional email details
 * @param {string} promoData.userEmail - User's email address
 * @param {string} promoData.userName - User's first name (optional)
 * @param {string} promoData.promoTitle - Title of the promotion
 * @param {string} promoData.promoDescription - Description of the promotion
 * @param {string} promoData.discountCode - Discount code (optional)
 * @param {number} promoData.discountPercentage - Discount percentage (optional)
 * @param {string} promoData.promoImage - URL to promotional image (optional)
 * @param {string} promoData.ctaLink - Call-to-action link
 * @param {string} promoData.ctaText - Call-to-action button text (default: 'Learn More')
 * @param {string} promoData.expiryDate - Promotion expiry date (optional)
 * @returns {Promise<Array>} SendGrid response
 */
const sendPromoEmail = async (promoData) => {
  try {
    const {
      userEmail,
      userName = 'Valued Member',
      promoTitle,
      promoDescription,
      discountCode,
      discountPercentage,
      promoImage,
      ctaLink,
      ctaText = 'Learn More',
      expiryDate
    } = promoData;

    if (!userEmail || !promoTitle || !promoDescription || !ctaLink) {
      throw new Error('Missing required promo data: userEmail, promoTitle, promoDescription, ctaLink');
    }

    const discountBadge = discountPercentage ? `
      <div style="display: inline-block; background-color: #dc3545; color: white; padding: 10px 20px; border-radius: 50px; font-weight: bold; font-size: 18px; margin: 10px 0;">
        ${discountPercentage}% OFF
      </div>
    ` : '';

    const promoImageSection = promoImage ? `
      <div style="margin: 20px 0; text-align: center;">
        <img src="${promoImage}" alt="Promotion" style="max-width: 100%; height: auto; border-radius: 8px;">
      </div>
    ` : '';

    const expirySection = expiryDate ? `
      <div style="background-color: #ffe5e5; border: 1px solid #ff6b6b; padding: 12px; border-radius: 4px; color: #c41e3a; margin: 15px 0; text-align: center; font-weight: 600;">
        ⏰ Offer expires on ${expiryDate}
      </div>
    ` : '';

    const discountCodeSection = discountCode ? `
      <div style="background-color: #e7f3ff; border: 2px dashed #1f77bc; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center;">
        <p style="margin: 0 0 10px 0; color: #666;">Use this exclusive code:</p>
        <p style="margin: 0; font-size: 24px; font-weight: bold; color: #1f77bc; font-family: 'Courier New', monospace; letter-spacing: 2px;">${discountCode}</p>
      </div>
    ` : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 0;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #1f77bc 0%, #1a5f94 100%);
              color: #ffffff;
              padding: 40px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 32px;
            }
            .header p {
              margin: 10px 0 0 0;
              opacity: 0.9;
            }
            .content {
              padding: 40px;
            }
            .content p {
              margin: 15px 0;
            }
            .cta-button {
              display: inline-block;
              background-color: #1f77bc;
              color: #ffffff;
              padding: 16px 40px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
              text-align: center;
              transition: background-color 0.3s;
            }
            .cta-button:hover {
              background-color: #1a5f94;
            }
            .footer {
              background-color: #f9f9f9;
              text-align: center;
              padding: 20px;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${promoTitle}</h1>
            </div>

            <div class="content">
              <p>Hi ${userName},</p>

              ${discountBadge}

              <p>${promoDescription}</p>

              ${promoImageSection}

              ${discountCodeSection}

              <div style="text-align: center; margin: 30px 0;">
                <a href="${ctaLink}" class="cta-button">${ctaText}</a>
              </div>

              ${expirySection}

              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                If you prefer not to receive promotional emails, you can <a href="[UNSUBSCRIBE_LINK]" style="color: #1f77bc; text-decoration: none;">unsubscribe here</a>.
              </p>
            </div>

            <div class="footer">
              <p>&copy; 2026 BaneWorkout. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const plainText = `
${promoTitle}

Hi ${userName},

${promoDescription}

${discountPercentage ? `Special Discount: ${discountPercentage}% OFF\n` : ''}
${discountCode ? `Use Code: ${discountCode}\n` : ''}

Call to Action: ${ctaLink}

${expiryDate ? `Offer expires on: ${expiryDate}\n` : ''}

Best regards,
The BaneWorkout Team
    `;

    return await sendEmail({
      to: userEmail,
      subject: `🎉 Exclusive Offer: ${promoTitle}`,
      text: plainText,
      html: htmlContent
    });
  } catch (error) {
    console.error('Error sending promo email:', error);
    throw new Error(`Failed to send promo email: ${error.message}`);
  }
};

/**
 * Verify that a sender email address is authorized in SendGrid
 * @param {string} senderEmail - Email address to verify
 * @returns {Promise<Object>} Verification status
 */
const verifySenderEmail = async (senderEmail) => {
  try {
    if (!senderEmail) {
      throw new Error('Sender email address is required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail)) {
      throw new Error('Invalid email format');
    }

    // SendGrid requires sender email verification
    // This function provides validation and verification status
    console.log(`Verifying sender email: ${senderEmail}`);

    // Check if email matches the configured SENDGRID_FROM_EMAIL
    const configuredEmail = process.env.SENDGRID_FROM_EMAIL;
    if (senderEmail === configuredEmail) {
      return {
        status: 'verified',
        email: senderEmail,
        message: 'Sender email is verified and authorized',
        verified: true
      };
    }

    // Additional verification would require SendGrid API call
    // For now, we'll return a verification status that indicates
    // the email needs to be added to SendGrid's verified senders
    return {
      status: 'pending',
      email: senderEmail,
      message: 'Email must be verified in SendGrid dashboard or added to verified senders',
      verified: false,
      instructions: [
        '1. Log in to SendGrid dashboard',
        '2. Navigate to Settings > Sender Authentication',
        '3. Add the email address and verify ownership',
        '4. Once verified, it can be used as a sender email'
      ]
    };
  } catch (error) {
    console.error('Error verifying sender email:', error);
    return {
      status: 'error',
      email: senderEmail,
      message: `Verification failed: ${error.message}`,
      verified: false,
      error: error.message
    };
  }
};

/**
 * Get email configuration status
 * @returns {Object} Configuration status
 */
const getEmailConfigStatus = () => {
  return {
    sendgridApiKey: !!process.env.SENDGRID_API_KEY,
    fromEmail: process.env.SENDGRID_FROM_EMAIL || 'Not configured',
    initialized: !!process.env.SENDGRID_API_KEY,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  initializeEmail,
  sendEmail,
  sendBulkEmails,
  sendProgramConfirmationEmail,
  sendPromoEmail,
  verifySenderEmail,
  getEmailConfigStatus
};
