const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(to, subject, html, attachments = []) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        html,
        attachments
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendResultNotification(studentEmail, studentName, results) {
    const subject = 'Your Exam Results are Available';
    const html = this.generateResultEmailTemplate(studentName, results);

    return this.sendEmail(studentEmail, subject, html);
  }

  async sendParentNotification(parentEmail, studentName, results) {
    const subject = `${studentName}'s Exam Results`;
    const html = this.generateParentResultTemplate(studentName, results);

    return this.sendEmail(parentEmail, subject, html);
  }

  async sendWelcomeEmail(userEmail, userName, temporaryPassword) {
    const subject = 'Welcome to SRMS - Your Account Details';
    const html = this.generateWelcomeEmailTemplate(userName, userEmail, temporaryPassword);

    return this.sendEmail(userEmail, subject, html);
  }

  async sendPasswordResetEmail(userEmail, userName, resetToken) {
    const subject = 'Password Reset Request - SRMS';
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = this.generatePasswordResetTemplate(userName, resetUrl);

    return this.sendEmail(userEmail, subject, html);
  }

  async sendAccessRequestEmail({ name, email, organization = '', message = '' }) {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER;
    const subject = 'SRMS Access Request';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; color: #2563eb; margin-bottom: 20px; }
          .content { color: #374151; }
          .field { margin-bottom: 12px; }
          .label { font-weight: 600; color: #111827; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SRMS Access Request</h1>
          </div>
          <div class="content">
            <p>A new access request has been submitted.</p>
            <div class="field"><span class="label">Name:</span> ${name}</div>
            <div class="field"><span class="label">Email:</span> ${email}</div>
            ${organization ? `<div class="field"><span class="label">Organization:</span> ${organization}</div>` : ''}
            ${message ? `<div class="field"><span class="label">Message:</span> ${message}</div>` : ''}
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(adminEmail, subject, html);
  }

  async sendBulkResultNotifications(notifications) {
    const promises = notifications.map(notification => {
      return this.sendResultNotification(
        notification.email,
        notification.studentName,
        notification.results
      );
    });

    try {
      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      console.log(`Bulk email results: ${successful} successful, ${failed} failed`);
      return { successful, failed, results };
    } catch (error) {
      console.error('Bulk email sending failed:', error);
      throw error;
    }
  }

  generateResultEmailTemplate(studentName, results) {
    const { student, marks, summary } = results;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; color: #2563eb; margin-bottom: 30px; }
          .student-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .results-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .results-table th, .results-table td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
          .results-table th { background: #2563eb; color: white; }
          .summary { background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          .grade-A { color: #059669; font-weight: bold; }
          .grade-B { color: #0891b2; font-weight: bold; }
          .grade-C { color: #ea580c; font-weight: bold; }
          .grade-F { color: #dc2626; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nepal National School Result Management System</h1>
            <h2>Examination Results</h2>
          </div>

          <div class="student-info">
            <h3>Student Information</h3>
            <p><strong>Name:</strong> ${studentName}</p>
            <p><strong>Roll No:</strong> ${student.rollNo}</p>
            <p><strong>Class:</strong> ${student.class}</p>
            <p><strong>Section:</strong> ${student.section}</p>
          </div>

          <table class="results-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              ${marks.map(mark => `
                <tr>
                  <td>${mark.subject.name}</td>
                  <td>${mark.marks}/100</td>
                  <td class="grade-${mark.grade.charAt(0)}">${mark.grade}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Subjects:</strong> ${summary.totalSubjects}</p>
            <p><strong>Average Marks:</strong> ${summary.averageMarks}%</p>
            <p><strong>Overall Grade:</strong> <span class="grade-${summary.overallGrade.charAt(0)}">${summary.overallGrade}</span></p>
            <p><strong>GPA:</strong> ${summary.gpa}/4.0</p>
          </div>

          <div class="footer">
            <p>This is an automated message from Nepal National School Result Management System.</p>
            <p>For any queries, please contact your school administration.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateParentResultTemplate(studentName, results) {
    return this.generateResultEmailTemplate(studentName, results)
      .replace('Examination Results', `${studentName}'s Examination Results`)
      .replace('This is an automated message', 'Dear Parent/Guardian,<br><br>We are pleased to share your child\'s examination results. This is an automated message');
  }

  generateWelcomeEmailTemplate(userName, userEmail, temporaryPassword) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; color: #2563eb; margin-bottom: 30px; }
          .credentials { background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
          .warning { background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 20px 0; color: #dc2626; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to SRMS</h1>
            <h2>Your Account Has Been Created</h2>
          </div>

          <p>Dear ${userName},</p>
          <p>Welcome to the Nepal National School Result Management System. Your account has been successfully created.</p>

          <div class="credentials">
            <h3>Your Login Credentials</h3>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
            <p><strong>Login URL:</strong> <a href="${process.env.FRONTEND_URL}/login">${process.env.FRONTEND_URL}/login</a></p>
          </div>

          <div class="warning">
            <strong>Important Security Notice:</strong>
            <ul>
              <li>This is a temporary password. Please change it immediately after your first login.</li>
              <li>Do not share your credentials with anyone.</li>
              <li>Keep your login information secure.</li>
            </ul>
          </div>

          <a href="${process.env.FRONTEND_URL}/login" class="button">Login to SRMS</a>

          <div class="footer">
            <p>If you have any questions or need assistance, please contact the system administrator.</p>
            <p>Nepal National School Result Management System</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generatePasswordResetTemplate(userName, resetUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; color: #2563eb; margin-bottom: 30px; }
          .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .warning { background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 20px 0; color: #dc2626; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>

          <p>Dear ${userName},</p>
          <p>We received a request to reset your password for your SRMS account.</p>
          <p>Click the button below to reset your password:</p>

          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>

          <div class="warning">
            <strong>Security Notice:</strong>
            <ul>
              <li>This link will expire in 1 hour for security purposes.</li>
              <li>If you didn't request this password reset, please ignore this email.</li>
              <li>Never share this reset link with anyone.</li>
            </ul>
          </div>

          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>

          <div class="footer">
            <p>If you need further assistance, please contact the system administrator.</p>
            <p>Nepal National School Result Management System</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service connection verified successfully');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
