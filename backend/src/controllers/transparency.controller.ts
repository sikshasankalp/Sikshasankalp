import { Request, Response, NextFunction } from 'express';
import { transparencyService } from '../services/transparency.service';
import { CreateTransparencyInput, UpdateTransparencyInput, TransparencyQueryInput } from '../validators/transparency.validator';

export const listTransparency = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query as unknown as TransparencyQueryInput;
    const isPublicRequest = true; // GET endpoints are public
    const result = await transparencyService.listTransparency(query, isPublicRequest);
    
    res.json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

export const getTransparencyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const isPublicRequest = true; // GET endpoints are public
    const item = await transparencyService.getTransparencyById(id, isPublicRequest);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const createTransparency = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body as CreateTransparencyInput;
    
    const serviceInput: CreateTransparencyInput = {
      title: data.title,
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      documentUrl: data.documentUrl,
      cloudinaryPublicId: data.cloudinaryPublicId,
      issuedDate: data.issuedDate,
      description: data.description,
      isPublished: data.isPublished
    };

    const item = await transparencyService.createTransparency(serviceInput);
    
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const updateTransparency = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = req.body as UpdateTransparencyInput;
    
    const serviceInput: UpdateTransparencyInput = {
      title: data.title,
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      documentUrl: data.documentUrl,
      cloudinaryPublicId: data.cloudinaryPublicId,
      issuedDate: data.issuedDate,
      description: data.description,
      isPublished: data.isPublished
    };

    const item = await transparencyService.updateTransparency(id, serviceInput);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTransparency = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await transparencyService.deleteTransparency(id);
    
    res.json({
      success: true,
      message: 'Transparency document deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
