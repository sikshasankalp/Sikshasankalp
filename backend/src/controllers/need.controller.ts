import { Request, Response, NextFunction } from 'express';
import { needService } from '../services/need.service';
import { CreateNeedInput, UpdateNeedInput, NeedQueryInput } from '../validators/need.validator';

export const listNeeds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const isPublic = !res.locals.isAdmin;
    const query = req.query as unknown as NeedQueryInput;
    const data = await needService.listNeeds(query, isPublic);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const getNeedById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = await needService.getNeedById(id);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const createNeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body as CreateNeedInput;
    const result = await needService.createNeed(data);

    res.status(201).json({
      success: true,
      message: 'Need requirement created successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const updateNeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = req.body as UpdateNeedInput;
    const result = await needService.updateNeed(id, data);

    res.json({
      success: true,
      message: 'Need requirement updated successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await needService.deleteNeed(id);

    res.json({
      success: true,
      message: 'Need requirement deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const seedNeeds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await needService.seedDefaultNeeds();
    res.json({
      success: true,
      message: 'Needs reset to defaults successfully',
      data
    });
  } catch (error) {
    next(error);
  }
};

