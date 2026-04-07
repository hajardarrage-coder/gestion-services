import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: process.env.ENV_PATH || path.resolve(__dirname, '..', '.env'),
});

const parseOrigins = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const config = {
  port: Number(process.env.PORT || 4000),
  allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:4173'),
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== 'false',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    fromName: process.env.MAIL_FROM_NAME || 'USMBA Dashboard',
  },
  recipients: {
    president: process.env.PRESIDENT_EMAIL || '',
    service: process.env.SERVICE_EMAIL || '',
  },
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME || 'flsh_stats',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
  },
  reset: {
    ttlMinutes: Number(process.env.RESET_CODE_TTL_MINUTES || 10),
    bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 12),
    maxRequestsPerHour: Number(process.env.RESET_MAX_ATTEMPTS_PER_HOUR || 5),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
