import { Request, Response, NextFunction } from 'express';
import { mediaService } from '../services/media.service';
import { CreateMediaInput, UpdateMediaInput, MediaQueryInput } from '../validators/media.validator';

export const listMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query as unknown as MediaQueryInput;
    const isPublicRequest = true; // GET endpoints are public
    const result = await mediaService.listMedia(query, isPublicRequest);
    
    res.json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

export const getMediaById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const isPublicRequest = true; // GET endpoints are public
    const item = await mediaService.getMediaById(id, isPublicRequest);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const createMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body as CreateMediaInput;
    
    const serviceInput: CreateMediaInput = {
      title: data.title,
      publication: data.publication,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      cloudinaryPublicId: data.cloudinaryPublicId,
      externalUrl: data.externalUrl,
      publishedAt: data.publishedAt,
      isFeatured: data.isFeatured,
      isPublished: data.isPublished
    };

    const item = await mediaService.createMedia(serviceInput);
    
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const updateMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = req.body as UpdateMediaInput;
    
    const serviceInput: UpdateMediaInput = {
      title: data.title,
      publication: data.publication,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      cloudinaryPublicId: data.cloudinaryPublicId,
      externalUrl: data.externalUrl,
      publishedAt: data.publishedAt,
      isFeatured: data.isFeatured,
      isPublished: data.isPublished
    };

    const item = await mediaService.updateMedia(id, serviceInput);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await mediaService.deleteMedia(id);
    
    res.json({
      success: true,
      message: 'Media coverage deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
