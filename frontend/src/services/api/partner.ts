const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

export interface Partner {
  id: string;
  organizationName: string;
  contactPerson: string;
  email: string;
  mobile: string;
  organizationType?: string;
  message?: string;
  status: 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface PartnerResponse {
  success: boolean;
  data: Partner[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const fetchPartnersAdmin = async (params: Record<string, string | number | boolean> = {}): Promise<PartnerResponse> => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const response = await fetch(`${API_URL}/partners?${query}`, {
    credentials: 'include'
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to fetch partners');
  return result;
};

export const updatePartnerStatus = async (id: string, status: string): Promise<Partner> => {
  const response = await fetch(`${API_URL}/partners/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status }),
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to update partner status');
  return result.data;
};

export const deletePartner = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/partners/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to delete partner');
};
