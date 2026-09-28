export interface DonationOrderRequest {
  amount: number;
  donorName: string;
  email: string;
  mobile: string;
  pan?: string;
  address?: string;
}

export interface DonationOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
}

export const createDonationOrder = async (data: DonationOrderRequest): Promise<DonationOrderResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Future implementation: POST /api/donations/order
  return {
    orderId: 'order_mock_' + Math.random().toString(36).substring(7),
    amount: data.amount,
    currency: 'INR'
  };
};

export const verifyDonationPayment = async (_paymentId: string, _orderId: string, _signature: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Future implementation: POST /api/donations/verify
  return true;
};
