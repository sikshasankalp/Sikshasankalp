import { prisma } from '../config/database';
import { AppError } from '../errors/AppError';
import { Prisma, DonationStatus } from '@prisma/client';
import { razorpayService } from './razorpay.service';
import { 
  CreateDonationOrderInput, 
  VerifyDonationInput, 
  DonationQueryInput 
} from '../validators/donation.validator';

const generateReceiptNumber = () => {
  const prefix = 'SSFDON';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

const adminSelect = {
  id: true,
  donorName: true,
  email: true,
  mobile: true,
  pan: true,
  address: true,
  amount: true,
  currency: true,
  status: true,
  razorpayOrderId: true,
  razorpayPaymentId: true,
  receiptNumber: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.DonationSelect;

export const donationService = {
  async listDonations(query: DonationQueryInput) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Prisma.DonationWhereInput = {};

    if (query.status) {
      where.status = query.status as DonationStatus;
    }

    if (query.search) {
      where.OR = [
        { donorName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { mobile: { contains: query.search, mode: 'insensitive' } },
        { receiptNumber: { contains: query.search, mode: 'insensitive' } },
        { razorpayOrderId: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: adminSelect,
      }),
      prisma.donation.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getDonationById(id: string) {
    const item = await prisma.donation.findUnique({
      where: { id },
      select: adminSelect,
    });

    if (!item) {
      throw new AppError('Donation not found', 404);
    }

    return item;
  },

  async createDonationOrder(data: CreateDonationOrderInput) {
    // 1. Create a CREATED/PENDING donation record first
    const donation = await prisma.donation.create({
      data: {
        donorName: data.donorName,
        email: data.email || null,
        mobile: data.mobile,
        pan: data.pan || null,
        address: data.address || null,
        amount: data.amount,
        status: 'CREATED',
      },
    });

    // 2. Create Razorpay order
    // Amount must be in paise
    const amountInPaise = Math.round(data.amount * 100);
    const order = await razorpayService.createOrder(amountInPaise, donation.id);

    // 3. Store Razorpay Order ID and mark as PENDING
    const updatedDonation = await prisma.donation.update({
      where: { id: donation.id },
      data: {
        razorpayOrderId: order.id,
        status: 'PENDING'
      },
    });

    return updatedDonation;
  },

  async verifyDonationPayment(data: VerifyDonationInput) {
    // 1. Verify Signature
    const isValid = razorpayService.verifySignature(
      data.razorpay_order_id,
      data.razorpay_payment_id,
      data.razorpay_signature
    );

    if (!isValid) {
      throw new AppError('Invalid payment signature', 400);
    }

    // 2. Find the donation by Razorpay order ID
    const donation = await prisma.donation.findFirst({
      where: { razorpayOrderId: data.razorpay_order_id },
    });

    if (!donation) {
      throw new AppError('Donation not found for this order', 404);
    }

    if (donation.status === 'SUCCESS') {
      // Idempotency: Already marked success (e.g. by webhook)
      return donation;
    }

    // 3. Mark success and generate receipt
    const receiptNumber = donation.receiptNumber || generateReceiptNumber();

    const updatedDonation = await prisma.donation.update({
      where: { id: donation.id },
      data: {
        status: 'SUCCESS',
        razorpayPaymentId: data.razorpay_payment_id,
        receiptNumber,
      },
    });

    // Optional: Send email if infrastructure is hooked up
    // emailService.sendDonationReceipt(updatedDonation).catch(console.error);

    return updatedDonation;
  },

  async processDonationWebhook(event: any) {
    // Basic structural validation
    if (!event || !event.event || !event.payload || !event.payload.payment) return;

    const payment = event.payload.payment.entity;
    const orderId = payment.order_id;
    const paymentId = payment.id;

    if (!orderId) return;

    const donation = await prisma.donation.findFirst({
      where: { razorpayOrderId: orderId },
    });

    if (!donation) return;

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      if (donation.status === 'SUCCESS') return; // Idempotency
      
      const receiptNumber = donation.receiptNumber || generateReceiptNumber();
      await prisma.donation.update({
        where: { id: donation.id },
        data: {
          status: 'SUCCESS',
          razorpayPaymentId: paymentId,
          receiptNumber,
        },
      });
      // Optional: trigger email
    } else if (event.event === 'payment.failed') {
      if (donation.status === 'SUCCESS') return; // Do not overwrite successful donation
      await prisma.donation.update({
        where: { id: donation.id },
        data: {
          status: 'FAILED',
          razorpayPaymentId: paymentId,
        },
      });
    }
  }
};
