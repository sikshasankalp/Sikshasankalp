import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
    }
  }
}
import { AuthRequest } from '../types/auth.types';
import { donationService } from '../services/donation.service';
import { receiptService } from '../services/receipt.service';
import { razorpayService } from '../services/razorpay.service';
import { prisma } from '../config/database';
import { config } from '../config/env';
import { AppError } from '../errors/AppError';
import {
  CreateDonationOrderInput,
  VerifyDonationInput,
  DonationQueryInput
} from '../validators/donation.validator';

export const listDonations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

export const getMyDonations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const query = req.query as unknown as DonationQueryInput;
    const result = await donationService.getMyDonations(userId, query);

    res.json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    next(error);
  }
};
export const getDonationById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

export const createDonationOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = req.body as CreateDonationOrderInput;
    const userId = req.user!.id;

    const donation = await donationService.createDonationOrder(data, userId);

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

export const verifyDonationPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = req.body as VerifyDonationInput;

    const donation = await donationService.verifyDonationPayment(data);

    res.json({
      success: true,
      data: {
        donationId: donation.id,
        status: donation.status,
        receiptNumber: donation.receiptNumber,
        receiptToken: donation.receiptToken,
        amount: donation.amount,
        createdAt: donation.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

export const processRazorpayWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const signatureHeader = req.headers['x-razorpay-signature'];

    const signature =
      typeof signatureHeader === 'string'
        ? signatureHeader
        : Array.isArray(signatureHeader)
          ? signatureHeader[0]
          : undefined;

    if (!signature) {
      throw new AppError('Missing Razorpay signature', 400);
    }

    const rawBody = req.rawBody;

    if (!rawBody) {
      throw new AppError(
        'Raw body not available for webhook verification',
        500
      );
    }

    const isValid = razorpayService.verifyWebhookSignature(
      rawBody,
      signature
    );

    if (!isValid) {
      throw new AppError('Invalid webhook signature', 400);
    }

    await donationService.processDonationWebhook(req.body);

    res.json({
      success: true
    });
  } catch (error) {
    next(error);
  }
};

export const downloadDonationReceipt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.params.token as string;
    if (!token) {
      throw new AppError('Receipt token is required', 400);
    }

    const donation = await prisma.donation.findUnique({
      where: { receiptToken: token }
    });

    if (!donation || donation.status !== 'SUCCESS') {
      throw new AppError('Receipt not found or donation is not successful', 404);
    }

    const pdfBuffer = await receiptService.generateReceiptPDF(donation);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${donation.receiptNumber?.replace(/\//g, '-')}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

export const downloadMyDonationReceipt = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;
    
    const { pdfBuffer, filename } = await donationService.generateMyDonationReceipt(id, userId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};