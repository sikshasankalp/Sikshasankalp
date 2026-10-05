import nodemailer from 'nodemailer';
import { config } from '../config/env';

export const maskEmailForLogs = (email: string | null | undefined): string => {
  if (!email || !email.includes('@')) return '[no-email]';
  const parts = email.split('@');
  const userPart = parts[0];
  const domainPart = parts[1];
  const maskedUser = userPart.length > 2 ? `${userPart.slice(0, 2)}***` : '***';
  return `${maskedUser}@${domainPart}`;
};

export interface EmailSendResult {
  messageId: string;
  response: string;
  accepted: string[];
  rejected: string[];
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

async function sendViaBrevo(payload: {
  to: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  attachment?: { filename: string; content: Buffer };
}): Promise<EmailSendResult> {
  const maskedTo = maskEmailForLogs(payload.to);
  console.log(`[EmailService-Brevo] Sending email via Brevo HTTPS API (port 443) to ${maskedTo}...`);

  const body: any = {
    sender: {
      name: 'Shiksha Sankalp Foundation',
      email: config.email.user
    },
    to: [
      {
        email: payload.to,
        ...(payload.toName ? { name: payload.toName } : {})
      }
    ],
    subject: payload.subject,
    htmlContent: payload.htmlContent
  };

  if (payload.attachment) {
    body.attachment = [
      {
        name: payload.attachment.filename,
        content: payload.attachment.content.toString('base64')
      }
    ];
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': config.brevoApiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data: any = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error(`[EmailService-Brevo] Brevo API error for ${maskedTo}:`, {
      status: response.status,
      statusText: response.statusText,
      data
    });
    throw new Error(data?.message || `Brevo API error: ${response.statusText}`);
  }

  console.log(`[EmailService-Brevo] Delivered to Brevo HTTPS API for ${maskedTo}. MessageId: ${data?.messageId}`);

  return {
    messageId: data?.messageId || 'brevo-sent',
    response: `201 OK Brevo messageId: ${data?.messageId}`,
    accepted: [payload.to],
    rejected: []
  };
}

export const sendResetPasswordEmail = async (to: string, resetLink: string) => {
  const maskedTo = maskEmailForLogs(to);
  const subject = 'Password Reset Request';
  const html = `
    <h2>Password Reset Request</h2>
    <p>You requested to reset your password. Please click the link below to set a new password:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>This link will expire in 15 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;

  if (config.brevoApiKey) {
    await sendViaBrevo({
      to,
      subject,
      htmlContent: html
    });
    return;
  }

  console.log(`[EmailService] Sending password reset email to ${maskedTo}...`);

  const mailOptions = {
    from: `"Shiksha Sankalp Foundation" <${config.email.user}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Password reset email delivered to ${maskedTo}. MessageId: ${info.messageId}`);
  } catch (error: any) {
    console.error(`[EmailService] Password reset email failed for ${maskedTo}:`, {
      message: error?.message,
      code: error?.code,
      command: error?.command,
      responseCode: error?.responseCode
    });
    throw error;
  }
};

export const sendVerificationEmail = async (to: string, verifyLink: string) => {
  const maskedTo = maskEmailForLogs(to);
  const subject = 'Verify your Email Address';
  const html = `
    <h2>Email Verification</h2>
    <p>Welcome to Shiksha Sankalp Foundation! Please verify your email address by clicking the link below:</p>
    <a href="${verifyLink}">Verify Email</a>
    <p>This link will expire in 24 hours.</p>
    <p>If you did not create an account, please ignore this email.</p>
  `;

  if (config.brevoApiKey) {
    await sendViaBrevo({
      to,
      subject,
      htmlContent: html
    });
    return;
  }

  console.log(`[EmailService] Sending verification email to ${maskedTo}...`);

  const mailOptions = {
    from: `"Shiksha Sankalp Foundation" <${config.email.user}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Verification email delivered to ${maskedTo}. MessageId: ${info.messageId}`);
  } catch (error: any) {
    console.error(`[EmailService] Verification email failed for ${maskedTo}:`, {
      message: error?.message,
      code: error?.code,
      command: error?.command,
      responseCode: error?.responseCode
    });
    throw error;
  }
};

export const sendDonationReceiptEmail = async (
  to: string,
  donorName: string,
  amount: number,
  receiptNumber: string,
  date: Date,
  pdfBuffer: Buffer
): Promise<EmailSendResult> => {
  const maskedTo = maskEmailForLogs(to);
  const cleanReceiptNumber = receiptNumber?.replace(/\//g, '-') || 'Receipt';
  const attachmentSizeKb = (pdfBuffer.length / 1024).toFixed(2);
  const subject = 'Donation Receipt – Shiksha Sankalp Foundation';
  const html = `
    <h2>Thank You for Your Donation!</h2>
    <p>Dear ${donorName},</p>
    <p>We have successfully received your generous donation of <strong>₹${amount.toLocaleString('en-IN')}</strong> on ${date.toLocaleDateString('en-IN')}.</p>
    <p>Your official receipt (No: ${receiptNumber}) is attached to this email.</p>
    <p>Your support empowers education and transforms lives. Thank you for being a part of Shiksha Sankalp Foundation.</p>
    <br/>
    <p>Warm regards,<br/>Shiksha Sankalp Foundation</p>
  `;

  if (config.brevoApiKey) {
    return await sendViaBrevo({
      to,
      toName: donorName,
      subject,
      htmlContent: html,
      attachment: {
        filename: `${cleanReceiptNumber}.pdf`,
        content: pdfBuffer
      }
    });
  }

  console.log(`[EmailService] Preparing donation receipt email for ${maskedTo} (Receipt: ${receiptNumber}, Attachment: ${attachmentSizeKb} KB)...`);

  const mailOptions = {
    from: `"Shiksha Sankalp Foundation" <${config.email.user}>`,
    to,
    subject,
    html,
    attachments: [
      {
        filename: `${cleanReceiptNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Donation receipt email delivered to SMTP provider for ${maskedTo}. Response: ${info.response}, MessageId: ${info.messageId}`);
    return {
      messageId: info.messageId,
      response: info.response,
      accepted: Array.isArray(info.accepted) ? info.accepted.map(String) : [],
      rejected: Array.isArray(info.rejected) ? info.rejected.map(String) : []
    };
  } catch (error: any) {
    console.error(`[EmailService] Failed to send receipt email to ${maskedTo}:`, {
      message: error?.message,
      code: error?.code,
      command: error?.command,
      responseCode: error?.responseCode,
      response: error?.response
    });
    throw error;
  }
};
