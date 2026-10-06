import multer from 'multer';

import { AppError } from '../errors/AppError';

const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const fileFilter: multer.Options['fileFilter'] = (
  _req,
  file,
  callback,
) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    callback(
      new AppError(
        'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
        400,
      ),
    );
    return;
  }

  callback(null, true);
};

export const uploadImageMiddleware = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter,
});