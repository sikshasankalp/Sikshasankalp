import nodemailer from 'nodemailer';
import { config } from '../config/env';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465, // true for 465, false for other ports
  auth: {
    user: config.smtp.user,
    pass: config.smtp.password,
  },
});

export const sendResetPasswordEmail = async (to: string, resetLink: string) => {
  const mailOptions = {
    from: `"Shiksha Sankalp Foundation" <${config.smtp.user}>`,
    to,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Please click the link below to set a new password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendVerificationEmail = async (to: string, verifyLink: string) => {
  const mailOptions = {
    from: `"Shiksha Sankalp Foundation" <${config.smtp.user}>`,
    to,
    subject: 'Verify your Email Address',
    html: `
      <h2>Email Verification</h2>
      <p>Welcome to Shiksha Sankalp Foundation! Please verify your email address by clicking the link below:</p>
      <a href="${verifyLink}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not create an account, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendDonationReceiptEmail = async (
  to: string,
  donorName: string,
  amount: number,
  receiptNumber: string,
  date: Date,
  pdfBuffer: Buffer
) => {
  const mailOptions = {
    from: `"Shiksha Sankalp Foundation" <${config.smtp.user}>`,
    to,
    subject: 'Donation Receipt – Shiksha Sankalp Foundation',
    html: `
      <h2>Thank You for Your Donation!</h2>
      <p>Dear ${donorName},</p>
      <p>We have successfully received your generous donation of <strong>₹${amount.toLocaleString('en-IN')}</strong> on ${date.toLocaleDateString('en-IN')}.</p>
      <p>Your official receipt (No: ${receiptNumber}) is attached to this email.</p>
      <p>Your support empowers education and transforms lives. Thank you for being a part of Shiksha Sankalp Foundation.</p>
      <br/>
      <p>Warm regards,<br/>Shiksha Sankalp Foundation</p>
    `,
    attachments: [
      {
        filename: `${receiptNumber.replace(/\//g, '-')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  await transporter.sendMail(mailOptions);
};
