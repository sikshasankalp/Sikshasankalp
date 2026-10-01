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
