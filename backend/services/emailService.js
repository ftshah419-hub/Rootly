import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';

let transporter = null;

if (ENV.EMAIL_USER && ENV.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    host: ENV.EMAIL_HOST,
    port: ENV.EMAIL_PORT,
    secure: ENV.EMAIL_PORT === 465,
    auth: {
      user: ENV.EMAIL_USER,
      pass: ENV.EMAIL_PASSWORD
    }
  });
}

export const sendEmail = async ({ to, subject, html, text }) => {
  if (!transporter) {
    console.log(`\n================= [SIMULATED OUTGOING EMAIL] =================`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${text || html}`);
    console.log(`==============================================================\n`);
    return { messageId: 'simulated-dev-id', simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: ENV.EMAIL_FROM,
      to,
      subject,
      text,
      html
    });
    return info;
  } catch (error) {
    console.error(`[Email Service Error] Failed sending to ${to}:`, error.message);
    // Don't crash auth flows if email sending fails in dev
    return { error: error.message };
  }
};

export const sendPasswordResetEmail = async (email, resetToken, userName = 'Neighbor') => {
  const resetLink = `${ENV.CLIENT_URL}/reset-password?token=${resetToken}`;
  const subject = 'Reset Your Rootly Password';
  const text = `Hello ${userName},\n\nYou requested a password reset for your Rootly Homegrown Produce Exchange account.\nPlease use the following link to reset your password:\n${resetLink}\n\nThis link is valid for 1 hour. If you did not request this, please ignore this email.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E9D8B9; border-radius: 12px; background-color: #FFFDF8;">
      <h2 style="color: #3E5035; margin-bottom: 8px;">Rootly Harvest Network</h2>
      <p style="color: #795640; font-size: 16px;">Hello ${userName},</p>
      <p style="color: #282B24; line-height: 1.6;">You requested a password reset for your Rootly account. Click the button below to choose a new password:</p>
      <div style="margin: 28px 0;">
        <a href="${resetLink}" style="background-color: #3E5035; color: #FFFDF8; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #795640; font-size: 12px;">This link expires in 1 hour. If you did not make this request, you can safely ignore this email.</p>
    </div>
  `;

  return await sendEmail({ to: email, subject, text, html });
};

export default {
  sendEmail,
  sendPasswordResetEmail
};
