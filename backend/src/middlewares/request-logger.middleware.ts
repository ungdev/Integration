import { Request } from 'express';
import morgan from 'morgan';

function getUserEmail(req: Request): string {
  const user = req?.user;

  if (!user || typeof user === 'string') {
    return '-';
  }

  const maybeEmail = (user as Record<string, unknown>)['userEmail'];
  return typeof maybeEmail === 'string' && maybeEmail.length > 0 ? maybeEmail : '-';
}

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
morgan.token('user-email', (req: Request) => getUserEmail(req));
morgan.token('statusColor', (req, res, args) => {
    // get the status code if response written
    var status = res.statusCode ?? undefined

    // get status color
    var color = status >= 500 ? 31 // red
        : status >= 400 ? 33 // yellow
            : status >= 300 ? 36 // cyan
                : status >= 200 ? 32 // green
                    : 0; // no color

    return '\x1b[' + color + 'm' + status + '\x1b[0m';
});

export const requestLogger = morgan(
  '\x1b[33m:method :url :statusColor :response-time ms - :client-ip - :user-email',
);
