import { Request, Response, NextFunction } from 'express';
import { partnerService } from '../services/partner.service';
import { CreatePartnerInput, UpdatePartnerInput, PartnerQueryInput } from '../validators/partner.validator';

export const listPartnerInquiries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query as unknown as PartnerQueryInput;
    const result = await partnerService.listPartnerInquiries(query);
    
    res.json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

export const getPartnerInquiryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const item = await partnerService.getPartnerInquiryById(id);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const createPartnerInquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body as CreatePartnerInput;
    
    const serviceInput: CreatePartnerInput = {
      organizationName: data.organizationName,
      contactPerson: data.contactPerson,
      email: data.email,
      mobile: data.mobile,
      organizationType: data.organizationType,
      message: data.message
    };

    const item = await partnerService.createPartnerInquiry(serviceInput);
    
    // Do not return sensitive info if not needed, but for now we just return a safe success response
    // To match instructions: "never expose unnecessary submitted PII in the response"
    res.status(201).json({
      success: true,
      message: 'Partnership inquiry submitted successfully',
      data: {
        id: item.id,
        createdAt: item.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updatePartnerInquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const data = req.body as UpdatePartnerInput;
    
    const serviceInput: UpdatePartnerInput = {
      status: data.status
    };

    const item = await partnerService.updatePartnerInquiry(id, serviceInput);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const deletePartnerInquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await partnerService.deletePartnerInquiry(id);
    
    res.json({
      success: true,
      message: 'Partner inquiry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
