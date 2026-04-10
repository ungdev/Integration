import { NextFunction, Request, Response } from 'express';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

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

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startedAt = new Date();

  res.on('finish', () => {
    const statusCode = res.statusCode;
    const color = statusCode >= 500 ? RED : GREEN;
    const timestamp = startedAt.toISOString();

    console.log(
      `${color}[${timestamp}] ${req.method} ${req.originalUrl} ${statusCode} ${getClientIp(req)}${RESET}`
    );
  });

  next();
}
