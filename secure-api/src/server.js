import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { httpLogger } from './logger.js';
import { emailRouter } from './routes/email.js';
import { passwordResetRouter } from './routes/reset.js';

const app = express();

app.use(httpLogger);
app.use(helmet());
app.use(
  cors({
    origin: config.allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: '6mb' }));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/send-email', emailRouter);
app.use('/', passwordResetRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvee' });
});

app.use((err, req, res, _next) => {
  req.log.error({ err }, 'Unhandled error');
  res.status(500).json({ message: 'Erreur interne' });
});

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Secure API listening on port ${config.port}`);
});
