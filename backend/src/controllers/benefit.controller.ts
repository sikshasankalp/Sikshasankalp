import { Request, Response, NextFunction } from 'express';
import { benefitService } from '../services/benefit.service';
import { CreateBenefitInput, UpdateBenefitInput } from '../validators/benefit.validator';

export const listBenefits = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const isPublic = !res.locals.isAdmin;
    const data = await benefitService.listBenefits(isPublic);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getBenefitById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = await benefitService.getBenefitById(id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createBenefit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body as CreateBenefitInput;
    const result = await benefitService.createBenefit(data);
    res.status(201).json({
      success: true,
      message: 'Support benefit created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBenefit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = req.body as UpdateBenefitInput;
    const result = await benefitService.updateBenefit(id, data);
    res.json({
      success: true,
      message: 'Support benefit updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBenefit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await benefitService.deleteBenefit(id);
    res.json({
      success: true,
      message: 'Support benefit deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const seedBenefits = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await benefitService.seedDefaultBenefits();
    res.json({
      success: true,
      message: 'Support benefits reset to defaults successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};
