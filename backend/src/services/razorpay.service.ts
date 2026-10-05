import Razorpay from 'razorpay';
import crypto from 'crypto';

import { config } from '../config/env';
import { AppError } from '../errors/AppError';

let razorpayInstance: Razorpay | null = null;

const getRazorpayInstance = (): Razorpay => {
  if (razorpayInstance) {
    return razorpayInstance;
  }

  if (
    !config.razorpay.keyId ||
    !config.razorpay.keySecret
  ) {
    throw new AppError(
      'Razorpay is not configured on the server.',
      500
    );
  }

  const keyIdPrefix = config.razorpay.keyId.substring(0, 8);
  console.log(
    `[Razorpay] Initializing client with keyId prefix: ${keyIdPrefix}... (len=${config.razorpay.keyId.length})`
  );

  razorpayInstance = new Razorpay({
    key_id: config.razorpay.keyId,
    key_secret: config.razorpay.keySecret
  });

  return razorpayInstance;
};

const safeCompareHex = (
  expected: string,
  received: string
): boolean => {
  if (
    !/^[a-fA-F0-9]{64}$/.test(expected) ||
    !/^[a-fA-F0-9]{64}$/.test(received)
  ) {
    return false;
  }

  const expectedBuffer = Buffer.from(
    expected,
    'hex'
  );

  const receivedBuffer = Buffer.from(
    received,
    'hex'
  );

  if (
    expectedBuffer.length !==
    receivedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    expectedBuffer,
    receivedBuffer
  );
};

export const razorpayService = {
  get razorpay(): Razorpay {
    return getRazorpayInstance();
  },

  async createOrder(
    amountInPaise: number,
    receiptId: string
  ) {
    if (
      !Number.isSafeInteger(amountInPaise) ||
      amountInPaise <= 0
    ) {
      throw new AppError(
        'Invalid Razorpay order amount.',
        400
      );
    }

    if (
      !receiptId ||
      receiptId.trim().length === 0
    ) {
      throw new AppError(
        'Invalid Razorpay receipt ID.',
        400
      );
    }

    try {
      return await this.razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId
      });
    } catch (error: any) {
      const errorDescription =
        error?.error?.description || error?.message || 'Failed to create Razorpay order';
      const statusCode = typeof error?.statusCode === 'number' ? error.statusCode : 502;

      console.error('[Razorpay] Order creation failed:', {
        statusCode,
        code: error?.error?.code || 'UNKNOWN',
        description: errorDescription
      });

      throw new AppError(
        statusCode === 401
          ? 'Payment gateway authentication failed. Please check server configuration.'
          : `Payment gateway error: ${errorDescription}`,
        statusCode >= 400 && statusCode < 500 ? statusCode : 502
      );
    }
  },

  async fetchPayment(
    paymentId: string
  ) {
    if (
      !paymentId ||
      paymentId.trim().length === 0
    ) {
      throw new AppError(
        'Invalid Razorpay payment ID.',
        400
      );
    }

    try {
      return await this.razorpay.payments.fetch(
        paymentId
      );
    } catch {
      throw new AppError(
        'Unable to verify Razorpay payment.',
        502
      );
    }
  },

  verifySignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    if (!config.razorpay.keySecret) {
      throw new AppError(
        'Razorpay secret is not configured.',
        500
      );
    }

    if (
      !orderId ||
      !paymentId ||
      !signature
    ) {
      return false;
    }

    const body =
      `${orderId}|${paymentId}`;

    const expectedSignature =
      crypto
        .createHmac(
          'sha256',
          config.razorpay.keySecret
        )
        .update(body, 'utf8')
        .digest('hex');

    return safeCompareHex(
      expectedSignature,
      signature
    );
  },

  verifyWebhookSignature(
    rawBody: Buffer,
    signature: string
  ): boolean {
    if (!config.razorpay.webhookSecret) {
      throw new AppError(
        'Razorpay webhook secret is not configured.',
        500
      );
    }

    if (
      !rawBody ||
      !Buffer.isBuffer(rawBody) ||
      !signature
    ) {
      return false;
    }

    const expectedSignature =
      crypto
        .createHmac(
          'sha256',
          config.razorpay.webhookSecret
        )
        .update(rawBody)
        .digest('hex');

    return safeCompareHex(
      expectedSignature,
      signature
    );
  }
};