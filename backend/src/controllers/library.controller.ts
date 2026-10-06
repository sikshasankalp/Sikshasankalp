import {
  NextFunction,
  Request,
  Response,
} from 'express';

import { libraryService } from '../services/library.service';
import { cloudinaryService } from '../services/cloudinary.service';

import {
  CreateLibraryInput,
  UpdateLibraryInput,
  LibraryQueryInput,
} from '../validators/library.validator';

export const listLibraryResources = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = req.query as unknown as LibraryQueryInput;
    const isPublicRequest = !res.locals.isAdmin;

    const result =
      await libraryService.listLibraryResources(
        query,
        isPublicRequest,
      );

    res.json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};

export const getLibraryResourceById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const isPublicRequest = !res.locals.isAdmin;

    const item =
      await libraryService.getLibraryResourceById(
        id,
        isPublicRequest,
      );

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const createLibraryResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let uploadedImage:
    | {
        secure_url: string;
        public_id: string;
      }
    | null = null;

  try {
    const data = req.body as CreateLibraryInput;

    if (req.file) {
      uploadedImage =
        await cloudinaryService.uploadImage(
          req.file.buffer,
          'siksha-sankalp/library',
        );
    }

    const item =
      await libraryService.createLibraryResource(
        data,
        data.fileUrl,
        uploadedImage?.public_id,
        uploadedImage?.secure_url,
      );

    uploadedImage = null;

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
   if (uploadedImage) {
  const uploadedPublicId = uploadedImage.public_id;

  await cloudinaryService
    .deleteImage(uploadedPublicId)
    .catch((cleanupError) => {
      console.error(
        `New library thumbnail cleanup failed for ${uploadedPublicId}:`,
        cleanupError,
      );
    });
}

    next(error);
  }
};

export const updateLibraryResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let uploadedImage:
    | {
        secure_url: string;
        public_id: string;
      }
    | null = null;

  try {
    const id = req.params.id as string;
    const data = req.body as UpdateLibraryInput;

    if (req.file) {
      uploadedImage =
        await cloudinaryService.uploadImage(
          req.file.buffer,
          'siksha-sankalp/library',
        );
    }

    const result =
      await libraryService.updateLibraryResource(
        id,
        data,
        data.fileUrl,
        uploadedImage?.public_id,
        uploadedImage?.secure_url,
      );

    uploadedImage = null;

    if (
      req.file &&
      result.previousCloudinaryPublicId
    ) {
      await cloudinaryService
        .deleteImage(
          result.previousCloudinaryPublicId,
        )
        .catch((cleanupError) => {
          console.error(
            `Old library thumbnail cleanup failed for ${result.previousCloudinaryPublicId}:`,
            cleanupError,
          );
        });
    }

    res.json({
      success: true,
      data: result.item,
    });
 } catch (error) {
  if (uploadedImage) {
    const uploadedPublicId = uploadedImage.public_id;

    await cloudinaryService
      .deleteImage(uploadedPublicId)
      .catch((cleanupError) => {
        console.error(
          `New library thumbnail cleanup failed for ${uploadedPublicId}:`,
          cleanupError,
        );
      });
  }

  next(error);
}
};

export const deleteLibraryResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params.id as string;

    const result =
      await libraryService.deleteLibraryResource(id);

    if (result.cloudinaryPublicId) {
      await cloudinaryService
        .deleteImage(result.cloudinaryPublicId)
        .catch((cleanupError) => {
          console.error(
            `Library thumbnail cleanup failed for ${result.cloudinaryPublicId}:`,
            cleanupError,
          );
        });
    }

    res.json({
      success: true,
      message:
        'Library resource deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};