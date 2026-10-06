import {
  Request,
  Response,
  NextFunction
} from 'express';
import multer from 'multer';
import { ZodError } from 'zod';

import { config } from '../config/env';
import { AppError } from './AppError';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[ErrorHandler] Error on ${_req.method} ${_req.path}:`, err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
    return;
  }

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        message: 'File size too large. Maximum allowed upload size is 25MB.'
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: err.message || 'File upload error'
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: (err as any).issues?.[0]?.message || err.message || 'Invalid request parameters'
    });
    return;
  }

  const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';

  res.status(500).json({
    success: false,
    message: errorMessage
  });
};