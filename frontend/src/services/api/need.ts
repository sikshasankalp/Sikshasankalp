import { API_URL } from '../../config/env';

export interface NgoNeed {
  id: string;
  title: string;
  category?: string | null;
  quantity?: string | null;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description?: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface NeedsResponse {
  success: boolean;
  data: NgoNeed[];
}

export const fetchNeeds = async (): Promise<NgoNeed[]> => {
  const response = await fetch(`${API_URL}/needs`);
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to fetch needs');
  return result.data;
};

export const fetchNeedsAdmin = async (): Promise<NgoNeed[]> => {
  const response = await fetch(`${API_URL}/needs/admin`, {
    credentials: 'include',
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to fetch admin needs');
  return result.data;
};

export const createNeed = async (payload: {
  title: string;
  category?: string;
  quantity?: string;
  urgency?: string;
  description?: string;
  isActive?: boolean;
  displayOrder?: number;
}): Promise<NgoNeed> => {
  const response = await fetch(`${API_URL}/needs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to create need');
  return result.data;
};

export const updateNeed = async (
  id: string,
  payload: Partial<{
    title: string;
    category?: string;
    quantity?: string;
    urgency?: string;
    description?: string;
    isActive?: boolean;
    displayOrder?: number;
  }>
): Promise<NgoNeed> => {
  const response = await fetch(`${API_URL}/needs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to update need');
  return result.data;
};

export const deleteNeed = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/needs/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to delete need');
};
