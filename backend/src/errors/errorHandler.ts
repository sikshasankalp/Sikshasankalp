import {
  Request,
  Response,
  NextFunction
} from 'express';

import { config } from '../config/env';
import { AppError } from './AppError';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (config.nodeEnv !== 'production') {
    console.error(err);
  } else {
    if (err instanceof AppError) {
      console.warn(`[AppError] ${err.statusCode} on ${_req.method} ${_req.path}: ${err.message}`);
    } else if (err instanceof Error) {
      console.error(`[UnhandledError] 500 on ${_req.method} ${_req.path}: ${err.name} - ${err.message}`);
    } else {
      console.error(`[UnhandledError] 500 on ${_req.method} ${_req.path}:`, err);
    }
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });

    return;
  }

  /**
   * Never expose unknown/internal error messages to clients.
   *
   * Database errors, third-party SDK errors, filesystem errors,
   * configuration errors, etc. may contain sensitive implementation
   * details.
   */
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
};