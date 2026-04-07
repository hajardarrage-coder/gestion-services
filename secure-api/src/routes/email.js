import express from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { config } from '../config.js';
import { sendEmail } from '../email.js';
import { logger } from '../logger.js';

const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
});

const attachmentSchema = z.object({
  filename: z.string().trim().min(1).max(120),
  content: z.string().min(1),
  mimetype: z.string().trim().max(120).optional(),
});

const emailSchema = z.object({
  recipient: z.enum(['president', 'service']),
  subject: z.string().trim().min(3, 'Sujet trop court').max(140, 'Sujet trop long'),
  body: z.string().trim().min(10, 'Message trop court').max(4000, 'Message trop long'),
  attachments: z.array(attachmentSchema).max(3).optional(),
});

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const emailRouter = express.Router();

emailRouter.post('/', emailLimiter, async (req, res) => {
  const parseResult = emailSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Champs invalides', issues: parseResult.error.issues });
  }

  const { recipient, subject, body, attachments = [] } = parseResult.data;
  const recipientAddress = config.recipients[recipient];

  if (!recipientAddress) {
    return res.status(400).json({ message: 'Adresse destinataire non configuree.' });
  }

  // Attachment safeguards
  const normalizedAttachments = [];
  let totalSize = 0;
  for (const file of attachments) {
    try {
      const buffer = Buffer.from(file.content, 'base64');
      totalSize += buffer.length;
      if (buffer.length > 2 * 1024 * 1024) {
        return res.status(400).json({ message: `Fichier ${file.filename} depasse 2MB.` });
      }
      normalizedAttachments.push({
        filename: file.filename,
        content: buffer,
        contentType: file.mimetype || 'application/octet-stream',
      });
    } catch (err) {
      return res.status(400).json({ message: `Fichier ${file.filename} invalide.` });
    }
  }

  if (totalSize > 5 * 1024 * 1024) {
    return res.status(400).json({ message: 'Le poids total des pieces jointes depasse 5MB.' });
  }

  const safeSubject = escapeHtml(subject);
  const safeBody = escapeHtml(body).replace(/\n/g, '<br />');

  const html = `
    <div style="font-family: Arial, sans-serif; color: #0f172a;">
      <p style="margin:0 0 12px 0;">Message envoye depuis le portail universitaire.</p>
      <p style="margin:0 0 12px 0;"><strong>Destinataire:</strong> ${recipient}</p>
      <p style="margin:0 0 12px 0;"><strong>Sujet:</strong> ${safeSubject}</p>
      <div style="padding:12px; border:1px solid #e2e8f0; border-radius:10px; background:#f8fafc;">${safeBody}</div>
      <p style="margin-top:16px; font-size:12px; color:#475569;">Ne pas repondre directement a cet email. Pour tout suivi, repondre via la plateforme.</p>
    </div>
  `;

  try {
    await sendEmail({
      to: recipientAddress,
      subject: `[USMBA] ${subject}`.slice(0, 150),
      html,
      attachments: normalizedAttachments,
    });

    logger.info({ recipient, subject }, 'Email envoye');
    return res.json({ message: 'Email envoye avec succes.' });
  } catch (err) {
    logger.error({ err }, 'Erreur envoi email');
    return res.status(500).json({ message: 'Impossible denvoyer le mail pour le moment.' });
  }
});
