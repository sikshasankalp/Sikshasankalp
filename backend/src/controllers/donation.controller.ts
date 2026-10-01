import { Request, Response, NextFunction } from 'express';
import { donationService } from '../services/donation.service';
import { razorpayService } from '../services/razorpay.service';
import { config } from '../config/env';
import { AppError } from '../errors/AppError';
import { CreateDonationOrderInput, VerifyDonationInput, DonationQueryInput } from '../validators/donation.validator';

export const listDonations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query as unknown as DonationQueryInput;
    const result = await donationService.listDonations(query);
    
    res.json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};

export const getDonationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const item = await donationService.getDonationById(id);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

export const createDonationOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body as CreateDonationOrderInput;
    
    const donation = await donationService.createDonationOrder(data);
    
    res.status(201).json({
      success: true,
      data: {
        donationId: donation.id,
        razorpayOrderId: donation.razorpayOrderId,
        amount: donation.amount,
        currency: donation.currency,
        keyId: config.razorpay.keyId
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyDonationPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = req.body as VerifyDonationInput;
    
    const donation = await donationService.verifyDonationPayment(data);
    
    res.json({
      success: true,
      data: {
        donationId: donation.id,
        status: donation.status,
        receiptNumber: donation.receiptNumber
      }
    });
  } catch (error) {
    next(error);
  }
};

export const processRazorpayWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    if (!signature) {
      throw new AppError('Missing Razorpay signature', 400);
    }

    const rawBody = (req as any).rawBody;
    if (!rawBody) {
      throw new AppError('Raw body not available for webhook verification', 500);
    }

    const isValid = razorpayService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      throw new AppError('Invalid webhook signature', 400);
    }

    // Body is verified, now process it
    // req.body should have been parsed by express.json() if it was valid JSON
    // but sometimes rawBody overrides standard body parsing if not careful.
    // However, since express.json() was called, req.body should be available.
    const event = req.body;
    await donationService.processDonationWebhook(event);

    res.json({ success: true });
  } catch (error) {
    // We don't want Razorpay to retry indefinitely on 500s unless it's a real failure
    // but sending 400 for bad signatures is correct.
    next(error);
  }
};
