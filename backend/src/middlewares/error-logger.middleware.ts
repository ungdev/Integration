import { ErrorRequestHandler } from 'express';

export const errorLogger: ErrorRequestHandler = (err, req, _res, next) => {
  const statusCode =
    typeof err?.statusCode === 'number'
      ? err.statusCode
      : typeof err?.status === 'number'
        ? err.status
        : 500;

  console.error('[request-error]', {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message: err?.message || 'Unknown error',
    stack: err?.stack
  });

  next(err);
};
