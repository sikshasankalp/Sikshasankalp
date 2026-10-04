import { API_URL } from '../../config/env';


export interface ContactMessage {
  id: string;
  name: string;
  email?: string;
  mobile: string;
  subject?: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export interface ContactResponse {
  success: boolean;
  data: ContactMessage[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const fetchContactsAdmin = async (params: Record<string, string | number | boolean> = {}): Promise<ContactResponse> => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const response = await fetch(`${API_URL}/contact?${query}`, {
    credentials: 'include'
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to fetch contact messages');
  return result;
};

export const updateContactStatus = async (id: string, status: string): Promise<ContactMessage> => {
  const response = await fetch(`${API_URL}/contact/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status }),
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to update message status');
  return result.data;
};

export const deleteContact = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/contact/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to delete message');
};
