import nodemailer from 'nodemailer';
import { config } from '../config/index.js';
import logger from '../config/logger.js';

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!config.smtp.host) {
    logger.warn('SMTP not configured — emails will be logged only');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    auth: config.smtp.user
      ? { user: config.smtp.user, pass: config.smtp.pass }
      : undefined,
  });

  return transporter;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const transport = getTransporter();
  const message = { from: `"${config.smtp.fromName}" <${config.smtp.from}>`, to, subject, html, text };

  if (!transport) {
    logger.info(`[Email mock] To: ${to} | Subject: ${subject}`);
    return { mocked: true };
  }

  return transport.sendMail(message);
};

export const sendVerificationEmail = async (user, rawToken) => {
  const url = `${config.clientUrl}/verify-email?token=${rawToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Verify your email',
    html: `<p>Hi ${user.name},</p><p>Click <a href="${url}">here</a> to verify your email. Link expires in 24 hours.</p>`,
    text: `Verify your email: ${url}`,
  });
};

export const sendPasswordResetEmail = async (user, rawToken) => {
  const url = `${config.clientUrl}/reset-password?token=${rawToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Password reset request',
    html: `<p>Hi ${user.name},</p><p>Reset your password: <a href="${url}">${url}</a></p><p>If you did not request this, ignore this email.</p>`,
    text: `Reset password: ${url}`,
  });
};
