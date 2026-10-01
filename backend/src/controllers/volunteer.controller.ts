import { Request, Response, NextFunction } from 'express';
import { volunteerService } from '../services/volunteer.service';
import { CreateVolunteerInput, UpdateVolunteerInput, VolunteerQueryInput } from '../validators/volunteer.validator';

export const listVolunteerApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query as unknown as VolunteerQueryInput;
    const result = await volunteerService.listVolunteerApplications(query);
    
    res.json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

export const getVolunteerApplicationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const item = await volunteerService.getVolunteerApplicationById(id);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const createVolunteerApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body as CreateVolunteerInput;
    
    const serviceInput: CreateVolunteerInput = {
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      city: data.city,
      skills: data.skills,
      interests: data.interests,
      message: data.message
    };

    const item = await volunteerService.createVolunteerApplication(serviceInput);
    
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const updateVolunteerApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = req.body as UpdateVolunteerInput;
    
    const serviceInput: UpdateVolunteerInput = {
      status: data.status
    };

    const item = await volunteerService.updateVolunteerApplication(id, serviceInput);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVolunteerApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await volunteerService.deleteVolunteerApplication(id);
    
    res.json({
      success: true,
      message: 'Volunteer application deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
