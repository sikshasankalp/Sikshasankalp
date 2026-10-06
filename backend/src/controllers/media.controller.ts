import {
  Request,
  Response,
  NextFunction
} from 'express';

import { mediaService } from '../services/media.service';
import { cloudinaryService } from '../services/cloudinary.service';
import { fetchArticleMetadata } from '../utils/fetchMetadata';

import {
  CreateMediaInput,
  UpdateMediaInput,
  MediaQueryInput
} from '../validators/media.validator';

export const listMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query =
      req.query as unknown as MediaQueryInput;

    const result = res.locals.isAdmin
      ? await mediaService.listMedia(query, false)
      : await mediaService.listMedia(query, true);

    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

export const getMediaById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;

    const item = res.locals.isAdmin
      ? await mediaService.getMediaById(id, false)
      : await mediaService.getMediaById(id, true);

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const createMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let uploadedPublicId: string | undefined;

  try {
    const data =
      req.body as CreateMediaInput;

    let thumbnailUrl = data.thumbnailUrl;
    let cloudinaryPublicId:
      | string
      | undefined;

    if (req.file) {
      const uploadResult =
        await cloudinaryService.uploadImage(
          req.file.buffer,
          'siksha-sankalp/media'
        );

      thumbnailUrl =
        uploadResult.secure_url;

      cloudinaryPublicId =
        uploadResult.public_id;

      uploadedPublicId =
        uploadResult.public_id;
    }

    try {
      const serviceInput: CreateMediaInput = {
        title: data.title,
        publication: data.publication,
        description: data.description,
        thumbnailUrl,
        externalUrl: data.externalUrl,
        category: data.category,
        displayLocation:
          data.displayLocation,
        publishedAt: data.publishedAt,
        isFeatured: data.isFeatured,
        isPublished: data.isPublished
      };

      if (serviceInput.externalUrl) {
        try {
          const meta = await fetchArticleMetadata(serviceInput.externalUrl);
          serviceInput.title = serviceInput.title || meta.title || 'Untitled Article';
          serviceInput.publication = serviceInput.publication || meta.publication || new URL(serviceInput.externalUrl).hostname;
          serviceInput.description = serviceInput.description || meta.description;
          serviceInput.thumbnailUrl = serviceInput.thumbnailUrl || meta.thumbnailUrl;
        } catch (err) {
          console.error('Failed to fetch metadata:', err);
          serviceInput.title = serviceInput.title || 'Untitled Article';
          serviceInput.publication = serviceInput.publication || new URL(serviceInput.externalUrl).hostname;
        }
      }

      const item =
        await mediaService.createMedia(
          serviceInput,
          cloudinaryPublicId
        );

      res.status(201).json({
        success: true,
        data: item
      });
    } catch (error) {
      if (uploadedPublicId) {
        await cloudinaryService
          .deleteImage(uploadedPublicId)
          .catch((cleanupError) => {
            console.error(
              'Failed to cleanup uploaded Cloudinary image:',
              cleanupError
            );
          });
      }

      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const updateMedia = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let uploadedPublicId: string | undefined;

  try {
    const id = req.params.id;

    const data =
      req.body as UpdateMediaInput;

    const existingItem =
      await mediaService.getMediaById(
        id,
        false
      );

    const oldCloudinaryPublicId =
      existingItem.cloudinaryPublicId;

    let thumbnailUrl = data.thumbnailUrl;
    let cloudinaryPublicId:
      | string
      | undefined;

    if (req.file) {
      const uploadResult =
        await cloudinaryService.uploadImage(
          req.file.buffer,
          'siksha-sankalp/media'
        );

      thumbnailUrl =
        uploadResult.secure_url;

      cloudinaryPublicId =
        uploadResult.public_id;

      uploadedPublicId =
        uploadResult.public_id;
    }

    try {
      const serviceInput: UpdateMediaInput = {
        title: data.title,
        publication: data.publication,
        description: data.description,
        thumbnailUrl,
        externalUrl: data.externalUrl,
        category: data.category,
        displayLocation:
          data.displayLocation,
        publishedAt: data.publishedAt,
        isFeatured: data.isFeatured,
        isPublished: data.isPublished
      };

      if (serviceInput.externalUrl) {
        try {
          const meta = await fetchArticleMetadata(serviceInput.externalUrl);
          serviceInput.title = serviceInput.title || meta.title || existingItem.title;
          serviceInput.publication = serviceInput.publication || meta.publication || existingItem.publication;
          serviceInput.description = serviceInput.description || meta.description || existingItem.description || undefined;
          serviceInput.thumbnailUrl = serviceInput.thumbnailUrl || meta.thumbnailUrl || existingItem.thumbnailUrl || undefined;
        } catch (err) {
          console.error('Failed to fetch metadata:', err);
          serviceInput.title = serviceInput.title || existingItem.title;
          serviceInput.publication = serviceInput.publication || existingItem.publication;
        }
      }

      const item =
        await mediaService.updateMedia(
          id,
          serviceInput,
          cloudinaryPublicId
        );

      if (
        req.file &&
        oldCloudinaryPublicId
      ) {
        try {
          await cloudinaryService.deleteImage(
            oldCloudinaryPublicId
          );
        } catch (cleanupError) {
          console.error(
            'Failed to cleanup old Cloudinary image:',
            cleanupError
          );
        }
      }

      res.status(200).json({
        success: true,
        data: item
      });
    } catch (error) {
      if (uploadedPublicId) {
        await cloudinaryService
          .deleteImage(uploadedPublicId)
          .catch((cleanupError) => {
            console.error(
              'Failed to cleanup uploaded Cloudinary image:',
              cleanupError
            );
          });
      }

      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;

    const existingItem =
      await mediaService.getMediaById(
        id,
        false
      );

    await mediaService.deleteMedia(id);

    if (existingItem.cloudinaryPublicId) {
      try {
        await cloudinaryService.deleteImage(
          existingItem.cloudinaryPublicId
        );
      } catch (cleanupError) {
        console.error(
          'Failed to cleanup Cloudinary image after DB deletion:',
          cleanupError
        );
      }
    }

    res.status(200).json({
      success: true,
      message:
        'Media coverage deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
