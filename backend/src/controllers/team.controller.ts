import { Request, Response, NextFunction } from 'express';
import { teamService } from '../services/team.service';
import { CreateTeamInput, UpdateTeamInput, TeamQueryInput } from '../validators/team.validator';

export const listTeamMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query as unknown as TeamQueryInput;
    const isPublicRequest = true; // GET endpoints are public
    const result = await teamService.listTeamMembers(query, isPublicRequest);
    
    res.json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

export const getTeamMemberById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const isPublicRequest = true; // GET endpoints are public
    const item = await teamService.getTeamMemberById(id, isPublicRequest);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const createTeamMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body as CreateTeamInput;
    
    const serviceInput: CreateTeamInput = {
      name: data.name,
      designation: data.designation,
      bio: data.bio,
      photoUrl: data.photoUrl,
      cloudinaryPublicId: data.cloudinaryPublicId,
      displayOrder: data.displayOrder,
      isPublished: data.isPublished
    };

    const item = await teamService.createTeamMember(serviceInput);
    
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const updateTeamMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = req.body as UpdateTeamInput;
    
    const serviceInput: UpdateTeamInput = {
      name: data.name,
      designation: data.designation,
      bio: data.bio,
      photoUrl: data.photoUrl,
      cloudinaryPublicId: data.cloudinaryPublicId,
      displayOrder: data.displayOrder,
      isPublished: data.isPublished
    };

    const item = await teamService.updateTeamMember(id, serviceInput);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTeamMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await teamService.deleteTeamMember(id);
    
    res.json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
