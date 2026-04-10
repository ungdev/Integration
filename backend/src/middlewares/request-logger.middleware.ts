import { Request } from 'express';
import morgan from 'morgan';

function getClientIp(req: Request): string {
  const forwardedFor = req.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0].trim();
  }

  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return forwardedFor[0];
  }

  return req.ip || req.socket.remoteAddress || 'unknown';
}

morgan.token('client-ip', (req: Request) => getClientIp(req));

export const requestLogger = morgan(':method :url :status :response-time ms - :client-ip');
