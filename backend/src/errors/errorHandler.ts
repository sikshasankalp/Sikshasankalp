import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';
import { AppError } from './AppError';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (config.nodeEnv !== 'production') {
    console.error(err);
  }

  let statusCode = err.statusCode || 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (statusCode >= 400 && statusCode < 500 && err.message) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
