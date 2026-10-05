import { prisma } from '../config/database';
import { AppError } from '../errors/AppError';
import {
  Prisma,
  DonationStatus
} from '@prisma/client';
import { razorpayService } from './razorpay.service';
import crypto from 'crypto';
import { receiptService } from './receipt.service';
import { sendDonationReceiptEmail } from '../utils/email';

import {
  CreateDonationOrderInput,
  VerifyDonationInput,
  DonationQueryInput
} from '../validators/donation.validator';

type RazorpayPaymentEntity = {
  id?: unknown;
  order_id?: unknown;
  amount?: unknown;
  currency?: unknown;
};

type RazorpayWebhookEvent = {
  event?: unknown;
  payload?: {
    payment?: {
      entity?: RazorpayPaymentEntity;
    };
  };
};

const generateReceiptNumber = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();
  const nextYear = (currentYear + 1).toString().slice(-2);
  const financialYear = `${currentYear}-${nextYear}`;
  const prefix = 'SSF';
  
  const sequence = await prisma.receiptSequence.upsert({
    where: { financialYear },
    update: { currentValue: { increment: 1 } },
    create: { financialYear, currentValue: 1 }
  });
  
  return `${prefix}/${sequence.currentValue.toString().padStart(6, '0')}/${financialYear}`;
};

const handleDonationEmail = async (donation: Prisma.DonationGetPayload<{}>) => {
  if (!donation.email || donation.receiptEmailSentAt) return;

  const leaseTimeout = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago

  // Optimistic lock by claiming the attempt if it hasn't been claimed recently
  const lock = await prisma.donation.updateMany({
    where: {
      id: donation.id,
      receiptEmailSentAt: null,
      OR: [
        { receiptEmailAttemptedAt: null },
        { receiptEmailAttemptedAt: { lt: leaseTimeout } }
      ]
    },
    data: {
      receiptEmailAttemptedAt: new Date()
    }
  });

  if (lock.count === 0) return;

  try {
    const pdfBuffer = await receiptService.generateReceiptPDF(donation);
    await sendDonationReceiptEmail(
      donation.email,
      donation.donorName,
      donation.amount,
      donation.receiptNumber!,
      donation.createdAt,
      pdfBuffer
    );
    
    // Mark as sent and clear the attempt lock
    await prisma.donation.update({
      where: { id: donation.id },
      data: { 
        receiptEmailSentAt: new Date(),
        receiptEmailAttemptedAt: null
      }
    });
  } catch (error) {
    console.error('Failed to send donation receipt email:', error);
    // Explicitly reset the lock so it can be retried immediately if a clean catch occurs.
    // If the process hard-crashes, the leaseTimeout handles it after 5 minutes.
    await prisma.donation.update({
      where: { id: donation.id },
      data: { receiptEmailAttemptedAt: null }
    });
  }
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
  updatedAt: true
} satisfies Prisma.DonationSelect;

const isRazorpayWebhookEvent = (
  event: unknown
): event is RazorpayWebhookEvent => {
  return (
    typeof event === 'object' &&
    event !== null
  );
};

const getPaymentEntity = (
  event: RazorpayWebhookEvent
): RazorpayPaymentEntity | null => {
  const entity =
    event.payload?.payment?.entity;

  if (
    !entity ||
    typeof entity !== 'object'
  ) {
    return null;
  }

  return entity;
};

const getStringValue = (
  value: unknown
): string | null => {
  return typeof value === 'string' &&
    value.trim().length > 0
    ? value.trim()
    : null;
};

const getNumberValue = (
  value: unknown
): number | null => {
  return typeof value === 'number' &&
    Number.isFinite(value)
    ? value
    : null;
};

const getExpectedAmountInPaise = (
  amountInRupees: number
): number => {
  return Math.round(
    amountInRupees * 100
  );
};

export const donationService = {
  async listDonations(
    query: DonationQueryInput
  ) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 12);
    const skip = (page - 1) * limit;

    const where: Prisma.DonationWhereInput = {};

    if (query.status) {
      where.status =
        query.status as DonationStatus;
    }

    if (query.search) {
      where.OR = [
        {
          donorName: {
            contains: query.search,
            mode: 'insensitive'
          }
        },
        {
          email: {
            contains: query.search,
            mode: 'insensitive'
          }
        },
        {
          mobile: {
            contains: query.search,
            mode: 'insensitive'
          }
        },
        {
          receiptNumber: {
            contains: query.search,
            mode: 'insensitive'
          }
        },
        {
          razorpayOrderId: {
            contains: query.search,
            mode: 'insensitive'
          }
        }
      ];
    }

    const [items, total] =
      await Promise.all([
        prisma.donation.findMany({
          where,
          skip,
          take: limit,
          orderBy: [
            {
              createdAt: 'desc'
            },
            {
              id: 'desc'
            }
          ],
          select: adminSelect
        }),

        prisma.donation.count({
          where
        })
      ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(
          total / limit
        )
      }
    };
  },

  async getMyDonations(
    userId: string,
    query: DonationQueryInput
  ) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 12);
    const skip = (page - 1) * limit;

    const where: Prisma.DonationWhereInput = {
      userId
    };

    if (query.status) {
      where.status = query.status as DonationStatus;
    }

    const userSelect = {
      id: true,
      donorName: true,
      amount: true,
      currency: true,
      status: true,
      receiptNumber: true,
      receiptGeneratedAt: true,
      razorpayOrderId: true,
      razorpayPaymentId: true,
      createdAt: true,
      updatedAt: true
    } satisfies Prisma.DonationSelect;

    const [items, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        select: userSelect
      }),
      prisma.donation.count({ where })
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async getDonationById(
    id: string
  ) {
    const item =
      await prisma.donation.findUnique({
        where: {
          id
        },
        select: adminSelect
      });

    if (!item) {
      throw new AppError(
        'Donation not found',
        404
      );
    }

    return item;
  },

  async createDonationOrder(
    data: CreateDonationOrderInput,
    userId: string
  ) {
    console.log('[DonationService] Creating initial donation record in DB...');
    const donation =
      await prisma.donation.create({
        data: {
          donorName: data.donorName,
          email: data.email || null,
          mobile: data.mobile,
          pan: data.pan || null,
          address: data.address || null,
          amount: data.amount,
          currency: 'INR',
          status: 'CREATED',
          userId
        }
      });
    console.log('[DonationService] Donation DB record created successfully');

    try {
      const amountInPaise =
        getExpectedAmountInPaise(
          donation.amount
        );

      console.log('[DonationService] Creating Razorpay order...');
      const order =
        await razorpayService.createOrder(
          amountInPaise,
          donation.id
        );
      console.log('[DonationService] Razorpay order created successfully');

      return await prisma.donation.update({
        where: {
          id: donation.id
        },
        data: {
          razorpayOrderId: order.id,
          status: 'PENDING'
        }
      });
    } catch (error) {
      console.error(
        '[DonationService] Order creation error:',
        error instanceof Error ? error.message : error
      );
      await prisma.donation.update({
        where: {
          id: donation.id
        },
        data: {
          status: 'FAILED'
        }
      });

      throw error;
    }
  },

  async verifyDonationPayment(
    data: VerifyDonationInput
  ) {
    /*
     * 1. Verify Razorpay HMAC signature.
     */
    const isValid =
      razorpayService.verifySignature(
        data.razorpay_order_id,
        data.razorpay_payment_id,
        data.razorpay_signature
      );

    if (!isValid) {
      throw new AppError(
        'Invalid payment signature',
        400
      );
    }

    /*
     * 2. Find our internal donation.
     */
    const donation =
      await prisma.donation.findFirst({
        where: {
          razorpayOrderId:
            data.razorpay_order_id
        }
      });

    if (!donation) {
      throw new AppError(
        'Donation not found for this order',
        404
      );
    }

    /*
     * 3. Idempotency.
     */
    if (
      donation.status === 'SUCCESS'
    ) {
      handleDonationEmail(donation).catch(console.error);
      return donation;
    }

    if (
      donation.status !== 'PENDING' &&
      donation.status !== 'CREATED'
    ) {
      throw new AppError(
        'Donation is not in a payable state',
        400
      );
    }

    /*
     * 4. Fetch the payment directly from
     * Razorpay. Do not trust the client
     * to tell us that payment succeeded.
     */
    const payment =
      await razorpayService.fetchPayment(
        data.razorpay_payment_id
      );

    /*
     * 5. Payment must belong to the
     * exact Razorpay order.
     */
    if (
      payment.id !==
      data.razorpay_payment_id
    ) {
      throw new AppError(
        'Payment verification failed',
        400
      );
    }

    if (
      payment.order_id !==
      donation.razorpayOrderId
    ) {
      throw new AppError(
        'Payment does not belong to this donation',
        400
      );
    }

    /*
     * 6. Payment must actually be captured.
     */
    if (
      payment.status !== 'captured'
    ) {
      throw new AppError(
        'Payment has not been captured',
        400
      );
    }

    /*
     * 7. Verify amount independently.
     */
    const expectedAmountInPaise =
      getExpectedAmountInPaise(
        donation.amount
      );

    if (
      payment.amount !==
      expectedAmountInPaise
    ) {
      throw new AppError(
        'Payment amount does not match donation amount',
        400
      );
    }

    /*
     * 8. Verify currency independently.
     */
    if (
      payment.currency !==
      donation.currency
    ) {
      throw new AppError(
        'Payment currency does not match donation currency',
        400
      );
    }

    /*
     * 9. Safe atomic success transition
     * We try to acquire a lock to do the success transition.
     */
    const updateResult = await prisma.donation.updateMany({
      where: {
        id: donation.id,
        status: { notIn: ['SUCCESS', 'REFUNDED'] }
      },
      data: {
        status: 'SUCCESS',
        razorpayPaymentId: data.razorpay_payment_id
      }
    });

    if (updateResult.count === 0) {
      // Another process (like webhook) already transitioned it
      const refreshedDonation = await prisma.donation.findUnique({
        where: { id: donation.id }
      });

      if (refreshedDonation?.status === 'SUCCESS') {
        handleDonationEmail(refreshedDonation).catch(console.error);
        return refreshedDonation;
      }

      throw new AppError(
        'Donation update failed or already modified',
        400
      );
    }

    // Since we successfully transitioned, generate receipt components safely
    const receiptNumber = donation.receiptNumber || await generateReceiptNumber();
    const receiptToken = donation.receiptToken || crypto.randomUUID();

    const updatedDonation = await prisma.donation.update({
      where: { id: donation.id },
      data: {
        receiptNumber,
        receiptToken,
        receiptGeneratedAt: donation.receiptGeneratedAt || new Date()
      }
    });

    // Send email asynchronously without blocking the response
    handleDonationEmail(updatedDonation).catch(console.error);

    return updatedDonation;
  },

  async processDonationWebhook(
    event: unknown
  ) {
    if (
      !isRazorpayWebhookEvent(event)
    ) {
      return;
    }

    const eventType =
      getStringValue(event.event);

    if (!eventType) {
      return;
    }

    const payment =
      getPaymentEntity(event);

    if (!payment) {
      return;
    }

    const orderId =
      getStringValue(
        payment.order_id
      );

    const paymentId =
      getStringValue(payment.id);

    if (!orderId || !paymentId) {
      return;
    }

    const donation =
      await prisma.donation.findFirst({
        where: {
          razorpayOrderId: orderId
        }
      });

    if (!donation) {
      return;
    }

    if (
      eventType ===
        'payment.captured' ||
      eventType === 'order.paid'
    ) {
      const paymentAmount =
        getNumberValue(
          payment.amount
        );

      const paymentCurrency =
        getStringValue(
          payment.currency
        );

      if (
        paymentAmount === null
      ) {
        return;
      }

      if (
        paymentCurrency !==
        donation.currency
      ) {
        return;
      }

      const expectedAmountInPaise =
        getExpectedAmountInPaise(
          donation.amount
        );

      if (
        paymentAmount !==
        expectedAmountInPaise
      ) {
        return;
      }

      if (
        donation.status === 'SUCCESS'
      ) {
        handleDonationEmail(donation).catch(console.error);
        return;
      }

      if (
        donation.status === 'REFUNDED'
      ) {
        return;
      }

      // Safe atomic success transition
      const updateResult = await prisma.donation.updateMany({
        where: {
          id: donation.id,
          status: { notIn: ['SUCCESS', 'REFUNDED'] }
        },
        data: {
          status: 'SUCCESS',
          razorpayPaymentId: paymentId
        }
      });

      if (updateResult.count > 0) {
        const receiptNumber = donation.receiptNumber || await generateReceiptNumber();
        const receiptToken = donation.receiptToken || crypto.randomUUID();

        const updatedDonation = await prisma.donation.update({
          where: { id: donation.id },
          data: {
            receiptNumber,
            receiptToken,
            receiptGeneratedAt: donation.receiptGeneratedAt || new Date()
          }
        });

        handleDonationEmail(updatedDonation).catch(console.error);
      } else {
        const refreshedDonation = await prisma.donation.findUnique({
          where: { id: donation.id }
        });
        if (refreshedDonation?.status === 'SUCCESS') {
          handleDonationEmail(refreshedDonation).catch(console.error);
        }
      }

      return;
    }

    if (
      eventType ===
      'payment.failed'
    ) {
      if (
        donation.status === 'SUCCESS' ||
        donation.status === 'REFUNDED'
      ) {
        return;
      }

      await prisma.donation.updateMany({
        where: {
          id: donation.id,
          status: { notIn: ['SUCCESS', 'REFUNDED'] }
        },
        data: {
          status: 'FAILED',
          razorpayPaymentId: paymentId
        }
      });
    }
  },

  async generateMyDonationReceipt(id: string, userId: string) {
    const donation = await prisma.donation.findUnique({
      where: { id }
    });

    if (!donation || donation.userId !== userId) {
      throw new AppError('Donation not found', 404);
    }

    if (donation.status !== 'SUCCESS') {
      throw new AppError('Donation is not successful yet', 400);
    }

    const pdfBuffer = await receiptService.generateReceiptPDF(donation);
    const filename = `${donation.receiptNumber?.replace(/\//g, '-')}.pdf`;

    return { pdfBuffer, filename };
  }
};