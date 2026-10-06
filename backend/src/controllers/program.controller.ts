import {
  Request,
  Response,
  NextFunction
} from 'express';

import {
  programService
} from '../services/program.service';

import {
  cloudinaryService
} from '../services/cloudinary.service';

import {
  CreateProgramInput,
  UpdateProgramInput,
  ProgramQueryInput
} from '../validators/program.validator';

const PROGRAM_CLOUDINARY_FOLDER =
  'siksha-sankalp/programs';

export const listPrograms = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query =
      req.query as unknown as ProgramQueryInput;

    const isPublicRequest =
      !res.locals.isAdmin;

    const result =
      await programService.listPrograms(
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

export const getProgramById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;

    const isPublicRequest =
      !res.locals.isAdmin;

    const item = isPublicRequest
      ? await programService.getProgramById(
          id,
          true
        )
      : await programService.getProgramById(
          id,
          false
        );

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const createProgram = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data =
      req.body as CreateProgramInput;

    let uploadedPublicId:
      | string
      | undefined;

    try {
      if (req.file) {
        const uploadResult =
          await cloudinaryService.uploadImage(
            req.file.buffer,
            PROGRAM_CLOUDINARY_FOLDER
          );

        uploadedPublicId =
          uploadResult.public_id;

        const item =
          await programService.createProgram({
            title: data.title,
            slug: data.slug,
            shortDescription:
              data.shortDescription,
            description:
              data.description,
            imageUrl:
              uploadResult.secure_url,
            cloudinaryPublicId:
              uploadResult.public_id,
            isFeatured:
              data.isFeatured ?? false,
            isPublished:
              data.isPublished ?? false,
            displayOrder:
              data.displayOrder ?? 0
          });

        res.status(201).json({
          success: true,
          data: item
        });

        return;
      }

      const item =
        await programService.createProgram({
          title: data.title,
          slug: data.slug,
          shortDescription:
            data.shortDescription,
          description:
            data.description,
          isFeatured:
            data.isFeatured ?? false,
          isPublished:
            data.isPublished ?? false,
          displayOrder:
            data.displayOrder ?? 0
        });

      res.status(201).json({
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
            'Failed to cleanup Cloudinary image after program creation failure:',
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

export const updateProgram = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;

    const data =
      req.body as UpdateProgramInput;

    const existingProgram =
      await programService.getProgramById(
        id,
        false
      );

    let uploadedPublicId:
      | string
      | undefined;

    try {
      let newImageUrl:
        | string
        | undefined;

      let newCloudinaryPublicId:
        | string
        | undefined;

      if (req.file) {
        const uploadResult =
          await cloudinaryService.uploadImage(
            req.file.buffer,
            PROGRAM_CLOUDINARY_FOLDER
          );

        newImageUrl =
          uploadResult.secure_url;

        newCloudinaryPublicId =
          uploadResult.public_id;

        uploadedPublicId =
          uploadResult.public_id;
      }

      const item =
        await programService.updateProgram(
          id,
          {
            title: data.title,
            slug: data.slug,
            shortDescription:
              data.shortDescription,
            description:
              data.description,
            ...(req.file
              ? {
                  imageUrl:
                    newImageUrl,
                  cloudinaryPublicId:
                    newCloudinaryPublicId
                }
              : {}),
            isFeatured:
              data.isFeatured,
            isPublished:
              data.isPublished,
            displayOrder:
              data.displayOrder
          }
        );

      if (
        uploadedPublicId &&
        existingProgram.cloudinaryPublicId
      ) {
        try {
          await cloudinaryService.deleteImage(
            existingProgram.cloudinaryPublicId
          );
        } catch (cleanupError) {
          console.error(
            'Failed to cleanup old Cloudinary program image:',
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
            'Failed to cleanup newly uploaded Cloudinary program image after update failure:',
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

export const deleteProgram = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;

    const existingProgram =
      await programService.getProgramById(
        id,
        false
      );

    await programService.deleteProgram(id);

    if (existingProgram.cloudinaryPublicId) {
      try {
        await cloudinaryService.deleteImage(
          existingProgram.cloudinaryPublicId
        );
      } catch (cleanupError) {
        console.error(
          'Failed to cleanup Cloudinary program image after deletion:',
          cleanupError
        );
      }
    }

    res.status(200).json({
      success: true,
      message:
        'Program deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};