import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';

export const getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const counts = await adminService.getDashboardStats();

    res.json({
      success: true,
      data: {
        counts
      }
    });
  } catch (error) {
    next(error);
  }
};
