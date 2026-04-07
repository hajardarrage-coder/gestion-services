import express from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '../db.js';
import { config } from '../config.js';
import { sendEmail } from '../email.js';
import { logger } from '../logger.js';

const requestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: config.reset.maxRequestsPerHour,
  standardHeaders: true,
  legacyHeaders: false,
});

const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Email invalide')
  .max(190);

const requestSchema = z.object({
  email: emailSchema,
});

const resetSchema = z.object({
  email: emailSchema,
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Code invalide'),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/, 'Ajouter une majuscule')
    .regex(/[a-z]/, 'Ajouter une minuscule')
    .regex(/\d/, 'Ajouter un chiffre')
    .regex(/[^A-Za-z0-9]/, 'Ajouter un caractere special'),
});

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const passwordResetRouter = express.Router();

passwordResetRouter.post('/reset-password-request', requestLimiter, async (req, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Email invalide' });
  }

  const { email } = parsed.data;

  try {
    const [users] = await query('SELECT id, name, email FROM users WHERE email = ? LIMIT 1', [email]);
    if (!users.length) {
      // Do not reveal existence
      return res.json({ message: 'Si le compte existe, un code a ete envoye.' });
    }

    const code = generateOtp();
    const hashed = await bcrypt.hash(code, config.reset.bcryptRounds);
    const expiresAt = new Date(Date.now() + config.reset.ttlMinutes * 60 * 1000);

    await query(
      `INSERT INTO password_reset_otps (email, otp_code, expires_at, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE otp_code = VALUES(otp_code), expires_at = VALUES(expires_at), updated_at = NOW()`,
      [email, hashed, expiresAt],
    );

    const html = `
      <div style="font-family: Arial, sans-serif; color: #0f172a;">
        <p style="margin:0 0 12px 0;">Bonjour,</p>
        <p style="margin:0 0 12px 0;">Voici votre code de reinitialisation de mot de passe :</p>
        <div style="font-size:26px; font-weight:700; letter-spacing:4px; background:#0f172a; color:#fff; padding:12px 18px; border-radius:12px; display:inline-block;">
          ${code}
        </div>
        <p style="margin:16px 0 12px 0;">Ce code expire dans ${config.reset.ttlMinutes} minutes.</p>
        <p style="margin:0; font-size:12px; color:#475569;">Si vous n'etes pas a l'origine de cette demande, ignorez cet email.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: 'Code de reinitialisation de mot de passe',
      html,
    });

    logger.info({ email }, 'OTP envoye');
    return res.json({ message: 'Code envoye par email.' });
  } catch (err) {
    logger.error({ err }, 'Erreur reset-password-request');
    return res.status(500).json({ message: 'Erreur lors de la generation du code.' });
  }
});

passwordResetRouter.post('/reset-password', resetLimiter, async (req, res) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Champs invalides' });
  }

  const { email, code, password } = parsed.data;

  try {
    const [rows] = await query('SELECT otp_code, expires_at FROM password_reset_otps WHERE email = ? LIMIT 1', [email]);
    if (!rows.length) {
      return res.status(400).json({ message: 'Code invalide ou expire.' });
    }

    const record = rows[0];
    const expiresAt = new Date(record.expires_at);
    if (Number.isNaN(expiresAt.getTime()) || expiresAt < new Date()) {
      return res.status(400).json({ message: 'Code invalide ou expire.' });
    }

    const match = await bcrypt.compare(code, record.otp_code);
    if (!match) {
      return res.status(400).json({ message: 'Code invalide ou expire.' });
    }

    const hashedPassword = await bcrypt.hash(password, config.reset.bcryptRounds);
    await query('UPDATE users SET password = ?, updated_at = NOW() WHERE email = ?', [hashedPassword, email]);
    await query('DELETE FROM password_reset_otps WHERE email = ?', [email]);

    logger.info({ email }, 'Mot de passe reinitialise');
    return res.json({ message: 'Mot de passe mis a jour. Vous pouvez vous connecter.' });
  } catch (err) {
    logger.error({ err }, 'Erreur reset-password');
    return res.status(500).json({ message: 'Impossible de reinitialiser le mot de passe.' });
  }
});

export { passwordResetRouter };
