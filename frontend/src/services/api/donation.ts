import { API_BASE_URL as API_URL } from '../../config/env';

import { fetchWithAuth } from '../apiClient';

export interface DonationOrderRequest {
  amount: number;
  donorName: string;
  email: string;
  mobile: string;
  pan?: string;
  address?: string;
}

export interface DonationOrderResponse {
  donationId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export const createDonationOrder = async (data: DonationOrderRequest): Promise<DonationOrderResponse> => {
  const response = await fetchWithAuth(`${API_URL}/api/donations/order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Failed to create order');
  }
  return result.data;
};

export const verifyDonationPayment = async (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
): Promise<any> => {
  const response = await fetchWithAuth(`${API_URL}/api/donations/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    }),
  });
  
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Payment verification failed');
  }
  return result.data;
};

export interface Donation {
  id: string;
  donorName: string;
  email?: string;
  mobile: string;
  pan?: string;
  address?: string;
  amount: number;
  currency: string;
  status: 'CREATED' | 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  receiptNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DonationListResponse {
  success: boolean;
  data: Donation[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const fetchDonationsAdmin = async (params: Record<string, string | number | boolean> = {}): Promise<DonationListResponse> => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const response = await fetchWithAuth(`${API_URL}/api/donations?${query}`, {
    credentials: 'include'
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to fetch donations');
  return result;
};

export const fetchDonationById = async (id: string): Promise<Donation> => {
  const response = await fetchWithAuth(`${API_URL}/api/donations/${id}`, {
    credentials: 'include'
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to fetch donation details');
  return result.data;
};
