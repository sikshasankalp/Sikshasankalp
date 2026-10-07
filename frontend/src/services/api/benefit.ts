import { API_URL } from '../../config/env';

export interface SupportBenefit {
  id: string;
  title: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const fetchBenefits = async (): Promise<SupportBenefit[]> => {
  const response = await fetch(`${API_URL}/benefits`);
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to fetch benefits');
  return result.data;
};

export const fetchBenefitsAdmin = async (): Promise<SupportBenefit[]> => {
  const response = await fetch(`${API_URL}/benefits/admin`, {
    credentials: 'include',
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to fetch admin benefits');
  return result.data;
};

export const createBenefit = async (payload: {
  title: string;
  displayOrder?: number;
  isActive?: boolean;
}): Promise<SupportBenefit> => {
  const response = await fetch(`${API_URL}/benefits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to create benefit');
  return result.data;
};

export const updateBenefit = async (
  id: string,
  payload: Partial<{
    title: string;
    displayOrder?: number;
    isActive?: boolean;
  }>
): Promise<SupportBenefit> => {
  const response = await fetch(`${API_URL}/benefits/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to update benefit');
  return result.data;
};

export const deleteBenefit = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/benefits/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to delete benefit');
};

export const seedBenefits = async (): Promise<SupportBenefit[]> => {
  const response = await fetch(`${API_URL}/benefits/seed`, {
    method: 'POST',
    credentials: 'include',
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to seed benefits');
  return result.data;
};
