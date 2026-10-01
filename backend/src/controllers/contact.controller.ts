import { Request, Response, NextFunction } from 'express';
import { contactService } from '../services/contact.service';
import { CreateContactInput, UpdateContactInput, ContactQueryInput } from '../validators/contact.validator';

export const listContactMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query as unknown as ContactQueryInput;
    const result = await contactService.listContactMessages(query);
    
    res.json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

export const getContactMessageById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const item = await contactService.getContactMessageById(id);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const createContactMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body as CreateContactInput;
    
    const serviceInput: CreateContactInput = {
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      subject: data.subject,
      message: data.message
    };

    await contactService.createContactMessage(serviceInput);
    
    res.status(201).json({
      success: true,
      message: 'Your message has been submitted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = req.body as UpdateContactInput;
    
    const serviceInput: UpdateContactInput = {
      status: data.status
    };

    const item = await contactService.updateContactMessage(id, serviceInput);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await contactService.deleteContactMessage(id);
    
    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
