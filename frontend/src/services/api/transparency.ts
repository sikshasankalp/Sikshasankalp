const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

export interface TransparencyDocument {
  id: string;
  title: string;
  description?: string;
  documentType: string;
  documentNumber?: string;
  issuedDate?: string;
  documentUrl: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransparencyResponse {
  success: boolean;
  data: TransparencyDocument[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const fetchTransparencyDocs = async (params?: { page?: number; limit?: number; documentType?: string; search?: string }): Promise<TransparencyResponse> => {
  const url = new URL(`${API_URL}/transparency`);
  if (params) {
    if (params.page) url.searchParams.append('page', String(params.page));
    if (params.limit) url.searchParams.append('limit', String(params.limit));
    if (params.documentType) url.searchParams.append('documentType', params.documentType);
    if (params.search) url.searchParams.append('search', params.search);
  }
  
  const response = await fetch(url.toString());
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result;
};

export const fetchTransparencyAdmin = async (params: Record<string, string | number | boolean> = {}): Promise<TransparencyResponse> => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const response = await fetch(`${API_URL}/transparency/admin?${query}`, {
    credentials: 'include'
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to fetch transparency documents');
  return result;
};

export const createTransparency = async (data: any): Promise<TransparencyDocument> => {
  const response = await fetch(`${API_URL}/transparency`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to create document');
  return result.data;
};

export const updateTransparency = async (id: string, data: any): Promise<TransparencyDocument> => {
  const response = await fetch(`${API_URL}/transparency/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to update document');
  return result.data;
};

export const deleteTransparency = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/transparency/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to delete document');
};
