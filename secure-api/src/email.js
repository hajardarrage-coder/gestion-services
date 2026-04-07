import nodemailer from 'nodemailer';
import { config } from './config.js';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  const fromAddress = config.smtp.fromName
    ? `${config.smtp.fromName} <${config.smtp.user}>`
    : config.smtp.user;

  return transporter.sendMail({
    from: fromAddress,
    to,
    subject,
    html,
    attachments,
  });
};
