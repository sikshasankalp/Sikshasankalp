import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/env';
import { AppError } from '../errors/AppError';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export const cloudinaryService = {
  /**
   * Uploads an image buffer to Cloudinary.
   */
  async uploadImage(fileBuffer: Buffer): Promise<{ secure_url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'shiksha-sankalp/gallery',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            return reject(new AppError('Failed to upload image to Cloudinary', 500));
          }
          if (!result) {
            return reject(new AppError('No result returned from Cloudinary upload', 500));
          }
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      // Write the buffer to the stream
      uploadStream.end(fileBuffer);
    });
  },

  /**
   * Deletes an image from Cloudinary by its public ID.
   */
  async deleteImage(publicId: string): Promise<void> {
    try {
      if (!publicId) return;
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result !== 'ok' && result.result !== 'not found') {
        throw new Error('Cloudinary destroy returned non-ok result');
      }
    } catch (error) {
      // Do not throw to the client, just log or ignore for cleanup safety
      // Wait, the prompt says "safely log cleanup failure"
      // We shouldn't throw AppError here if it's during cleanup, let the controller handle logging
      throw new AppError('Failed to delete image from Cloudinary', 500);
    }
  },
};
