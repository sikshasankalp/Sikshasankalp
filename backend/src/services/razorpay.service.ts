import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../config/env';
import { AppError } from '../errors/AppError';

// Initialize only if keys are present to avoid startup crash if not configured
let razorpayInstance: Razorpay | null = null;
if (config.razorpay.keyId && config.razorpay.keySecret) {
  razorpayInstance = new Razorpay({
    key_id: config.razorpay.keyId,
    key_secret: config.razorpay.keySecret,
  });
}

export const razorpayService = {
  get razorpay() {
    if (!razorpayInstance) {
      throw new AppError('Razorpay is not configured on the server.', 500);
    }
    return razorpayInstance;
  },

  async createOrder(amountInPaise: number, receiptId: string) {
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
    };
    
    return this.razorpay.orders.create(options);
  },

  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    if (!config.razorpay.keySecret) {
      throw new AppError('Razorpay secret is not configured.', 500);
    }
    
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(body.toString())
      .digest('hex');
      
    return expectedSignature === signature;
  },

  verifyWebhookSignature(rawBody: Buffer, signature: string): boolean {
    if (!config.razorpay.webhookSecret) {
      throw new AppError('Razorpay webhook secret is not configured.', 500);
    }
    
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.webhookSecret)
      .update(rawBody)
      .digest('hex');
      
    return expectedSignature === signature;
  }
};
