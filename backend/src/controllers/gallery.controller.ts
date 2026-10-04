import {
  Request,
  Response,
  NextFunction
} from 'express';

import { galleryService } from '../services/gallery.service';
import { cloudinaryService } from '../services/cloudinary.service';

import {
  CreateGalleryInput,
  UpdateGalleryInput,
  GalleryQueryInput
} from '../validators/gallery.validator';

import { AppError } from '../errors/AppError';

const GALLERY_CLOUDINARY_FOLDER =
  'shiksha-sankalp/gallery';

export const listGallery = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query =
      req.query as unknown as GalleryQueryInput;

    const isPublicRequest =
      !res.locals.isAdmin;

    const result =
      await galleryService.listGalleryItems(
        query,
        isPublicRequest
      );

    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

export const getGalleryById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;

    const isPublicRequest =
      !res.locals.isAdmin;

    const item = res.locals.isAdmin
      ? await galleryService.getGalleryItemById(id, false)
      : await galleryService.getGalleryItemById(id, true);

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const createGallery = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError(
        'Image file is required',
        400
      );
    }

    const data =
      req.body as CreateGalleryInput;

    const uploadResult =
      await cloudinaryService.uploadImage(
        req.file.buffer,
        GALLERY_CLOUDINARY_FOLDER
      );

    try {
      const serviceInput: CreateGalleryInput = {
        title: data.title,
        description: data.description,
        category: data.category,
        displayLocation:
          data.displayLocation,
        eventDate: data.eventDate,
        isFeatured:
          data.isFeatured ?? false,
        isPublished:
          data.isPublished ?? false
      };

      const item =
        await galleryService.createGalleryItem(
          serviceInput,
          uploadResult.secure_url,
          uploadResult.public_id
        );

      res.status(201).json({
        success: true,
        data: item
      });
    } catch (error) {
      try {
        await cloudinaryService.deleteImage(
          uploadResult.public_id
        );
      } catch (cleanupError) {
        console.error(
          'Failed to cleanup Cloudinary image after gallery creation failure:',
          cleanupError
        );
      }

      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const updateGallery = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;

    const data =
      req.body as UpdateGalleryInput;

    const existingItem =
      await galleryService.getGalleryItemById(
        id,
        false
      );

    let oldCloudinaryPublicId =
      existingItem.cloudinaryPublicId ?? undefined;

    let uploadedPublicId: string | null =
      null;

    let uploadedSecureUrl: string | undefined = undefined;

    if (req.file) {
      const uploadResult =
        await cloudinaryService.uploadImage(
          req.file.buffer,
          GALLERY_CLOUDINARY_FOLDER
        );

      uploadedPublicId =
        uploadResult.public_id;

      uploadedSecureUrl =
        uploadResult.secure_url;
    }

    try {
      const serviceInput: UpdateGalleryInput = {
        title: data.title,
        description: data.description,
        category: data.category,
        displayLocation:
          data.displayLocation,
        eventDate: data.eventDate,
        isFeatured:
          data.isFeatured,
        isPublished:
          data.isPublished
      };

      const item =
        await galleryService.updateGalleryItem(
          id,
          serviceInput,
          uploadedSecureUrl,
          uploadedPublicId ?? undefined
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
        try {
          await cloudinaryService.deleteImage(
            uploadedPublicId
          );
        } catch (cleanupError) {
          console.error(
            'Failed to cleanup newly uploaded Cloudinary image after gallery update failure:',
            cleanupError
          );
        }
      }

      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const deleteGallery = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;

    const existingItem =
      await galleryService.getGalleryItemById(
        id,
        false
      );

    await galleryService.deleteGalleryItem(id);

    if (existingItem.cloudinaryPublicId) {
      try {
        await cloudinaryService.deleteImage(
          existingItem.cloudinaryPublicId
        );
      } catch (cleanupError) {
        console.error(
          'Failed to cleanup Cloudinary image after gallery deletion:',
          cleanupError
        );
      }
    }

    res.status(200).json({
      success: true,
      message:
        'Gallery item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};