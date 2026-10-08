import { v2 as cloudinary } from 'cloudinary';

import { config } from '../config/env';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

const DEFAULT_FOLDER = 'siksha-sankalp/gallery';

export const cloudinaryService = {
  async uploadImage(
    fileBuffer: Buffer,
    folder: string = DEFAULT_FOLDER
  ): Promise<CloudinaryUploadResult> {
    if (!Buffer.isBuffer(fileBuffer) || fileBuffer.length === 0) {
      throw new Error('Invalid image buffer');
    }

    if (!folder.trim()) {
      throw new Error('Cloudinary folder cannot be empty');
    }

    return new Promise<CloudinaryUploadResult>((resolve, reject) => {
      let settled = false;

      const fail = (error: Error): void => {
        if (settled) return;

        settled = true;
        reject(error);
      };

      const succeed = (result: CloudinaryUploadResult): void => {
        if (settled) return;

        settled = true;
        resolve(result);
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder.trim(),
          resource_type: 'image',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error || !result) {
            fail(new Error('Cloudinary image upload failed'));
            return;
          }

          if (
            typeof result.secure_url !== 'string' ||
            !result.secure_url ||
            typeof result.public_id !== 'string' ||
            !result.public_id
          ) {
            fail(new Error('Cloudinary returned an invalid upload result'));
            return;
          }

          succeed({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      uploadStream.on('error', () => {
        fail(new Error('Cloudinary image upload stream failed'));
      });

      uploadStream.end(fileBuffer);
    });
  },

  async deleteImage(publicId: string): Promise<void> {
    const normalizedPublicId = publicId.trim();

    if (!normalizedPublicId) {
      return;
    }

    const result = await cloudinary.uploader.destroy(normalizedPublicId);

    if (
      result.result !== 'ok' &&
      result.result !== 'not found'
    ) {
      throw new Error('Cloudinary image deletion failed');
    }
  },
};