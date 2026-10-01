import { Request, Response, NextFunction } from 'express';
import { programService } from '../services/program.service';
import { CreateProgramInput, UpdateProgramInput, ProgramQueryInput } from '../validators/program.validator';

export const listPrograms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query as unknown as ProgramQueryInput;
    const isPublicRequest = true; // GET endpoints are public
    const result = await programService.listPrograms(query, isPublicRequest);
    
    res.json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

export const getProgramById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const isPublicRequest = true; // GET endpoints are public
    const item = await programService.getProgramById(id, isPublicRequest);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const createProgram = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body as CreateProgramInput;
    
    const serviceInput: CreateProgramInput = {
      title: data.title,
      slug: data.slug,
      shortDescription: data.shortDescription,
      description: data.description,
      imageUrl: data.imageUrl,
      cloudinaryPublicId: data.cloudinaryPublicId,
      isFeatured: data.isFeatured,
      isPublished: data.isPublished,
      displayOrder: data.displayOrder
    };

    const item = await programService.createProgram(serviceInput);
    
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const updateProgram = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = req.body as UpdateProgramInput;
    
    const serviceInput: UpdateProgramInput = {
      title: data.title,
      slug: data.slug,
      shortDescription: data.shortDescription,
      description: data.description,
      imageUrl: data.imageUrl,
      cloudinaryPublicId: data.cloudinaryPublicId,
      isFeatured: data.isFeatured,
      isPublished: data.isPublished,
      displayOrder: data.displayOrder
    };

    const item = await programService.updateProgram(id, serviceInput);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProgram = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await programService.deleteProgram(id);
    
    res.json({
      success: true,
      message: 'Program deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
