import { Request, Response, NextFunction } from 'express';
import { libraryService } from '../services/library.service';
import { CreateLibraryInput, UpdateLibraryInput, LibraryQueryInput } from '../validators/library.validator';

export const listLibraryResources = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query as unknown as LibraryQueryInput;
    const isPublicRequest = true; // GET endpoints are public
    const result = await libraryService.listLibraryResources(query, isPublicRequest);
    
    res.json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

export const getLibraryResourceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const isPublicRequest = true; // GET endpoints are public
    const item = await libraryService.getLibraryResourceById(id, isPublicRequest);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const createLibraryResource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body as CreateLibraryInput;
    
    const serviceInput: CreateLibraryInput = {
      title: data.title,
      description: data.description,
      category: data.category,
      fileUrl: data.fileUrl,
      cloudinaryPublicId: data.cloudinaryPublicId,
      thumbnailUrl: data.thumbnailUrl,
      fileType: data.fileType,
      fileSize: data.fileSize,
      isPublished: data.isPublished
    };

    const item = await libraryService.createLibraryResource(serviceInput);
    
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const updateLibraryResource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = req.body as UpdateLibraryInput;
    
    const serviceInput: UpdateLibraryInput = {
      title: data.title,
      description: data.description,
      category: data.category,
      fileUrl: data.fileUrl,
      cloudinaryPublicId: data.cloudinaryPublicId,
      thumbnailUrl: data.thumbnailUrl,
      fileType: data.fileType,
      fileSize: data.fileSize,
      isPublished: data.isPublished
    };

    const item = await libraryService.updateLibraryResource(id, serviceInput);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLibraryResource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await libraryService.deleteLibraryResource(id);
    
    res.json({
      success: true,
      message: 'Library resource deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
