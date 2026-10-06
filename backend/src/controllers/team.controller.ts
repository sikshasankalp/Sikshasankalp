import {
  Request,
  Response,
  NextFunction
} from 'express';

import { teamService } from '../services/team.service';
import { cloudinaryService } from '../services/cloudinary.service';

import {
  CreateTeamInput,
  UpdateTeamInput,
  TeamQueryInput
} from '../validators/team.validator';

export const listTeamMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query =
      req.query as unknown as TeamQueryInput;

    const isPublicRequest =
      !res.locals.isAdmin;

    const result =
      await teamService.listTeamMembers(
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

export const getTeamMemberById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;

    const isPublicRequest =
      !res.locals.isAdmin;

    const item =
      await teamService.getTeamMemberById(
        id,
        isPublicRequest
      );

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const createTeamMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let uploadPublicId: string | undefined;

  try {
    const data =
      req.body as CreateTeamInput;

    let photoUrl = data.photoUrl;
    let cloudinaryPublicId: string | undefined;

    if (req.file) {
      const uploadResult =
        await cloudinaryService.uploadImage(
          req.file.buffer,
          'siksha-sankalp/team'
        );

      photoUrl = uploadResult.secure_url;
      cloudinaryPublicId =
        uploadResult.public_id;

      uploadPublicId =
        uploadResult.public_id;
    }

    try {
      const serviceInput = {
        name: data.name,
        designation: data.designation,
        bio: data.bio,
        responsibilities:
          data.responsibilities,
        expertise: data.expertise,
        department: data.department,
        photoUrl,
        cloudinaryPublicId,
        displayOrder:
          data.displayOrder,
        isActive:
          data.isActive,
        isPublished:
          data.isPublished
      };

      const item =
        await teamService.createTeamMember(
          serviceInput
        );

      res.status(201).json({
        success: true,
        data: item
      });
    } catch (error) {
      if (uploadPublicId) {
        await cloudinaryService
          .deleteImage(uploadPublicId)
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

export const updateTeamMember = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let uploadPublicId: string | undefined;

  try {
    const id = req.params.id;

    const data =
      req.body as UpdateTeamInput;

    const existingItem =
      await teamService.getTeamMemberById(
        id,
        false
      );

    const oldCloudinaryPublicId =
      existingItem.cloudinaryPublicId;

    let photoUrl = data.photoUrl;
    let cloudinaryPublicId: string | undefined;

    if (req.file) {
      const uploadResult =
        await cloudinaryService.uploadImage(
          req.file.buffer,
          'siksha-sankalp/team'
        );

      photoUrl = uploadResult.secure_url;
      cloudinaryPublicId =
        uploadResult.public_id;

      uploadPublicId =
        uploadResult.public_id;
    }

    try {
      const serviceInput = {
        name: data.name,
        designation: data.designation,
        bio: data.bio,
        responsibilities:
          data.responsibilities,
        expertise: data.expertise,
        department: data.department,
        photoUrl,
        cloudinaryPublicId,
        displayOrder:
          data.displayOrder,
        isActive:
          data.isActive,
        isPublished:
          data.isPublished
      };

      const item =
        await teamService.updateTeamMember(
          id,
          serviceInput
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
      if (uploadPublicId) {
        await cloudinaryService
          .deleteImage(uploadPublicId)
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

export const deleteTeamMember = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;

    const existingItem =
      await teamService.getTeamMemberById(
        id,
        false
      );

    await teamService.deleteTeamMember(id);

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
        'Team member deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};