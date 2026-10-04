import { Request, Response, NextFunction } from 'express';
import { impactService } from '../services/impact.service';
import { CreateImpactMetricInput, UpdateImpactMetricInput } from '../validators/impact.validator';

export const listImpactMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const isPublicRequest = !res.locals.isAdmin;
    const items = await impactService.listImpactMetrics(isPublicRequest);
    
    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const getImpactMetricById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const isPublicRequest = !res.locals.isAdmin;
    const item = await impactService.getImpactMetricById(id, isPublicRequest);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const createImpactMetric = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body as CreateImpactMetricInput;
    const item = await impactService.createImpactMetric(data);
    
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const updateImpactMetric = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = req.body as UpdateImpactMetricInput;
    const item = await impactService.updateImpactMetric(id, data);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const deleteImpactMetric = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await impactService.deleteImpactMetric(id);
    
    res.json({
      success: true,
      message: 'Impact metric deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
