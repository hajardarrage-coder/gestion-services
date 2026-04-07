import pino from 'pino';
import pinoHttp from 'pino-http';
import { config } from './config.js';

export const logger = pino({ level: config.logging.level });
export const httpLogger = pinoHttp({
  logger,
  redact: ['req.headers.authorization', 'req.body.password', 'req.body.code'],
});
