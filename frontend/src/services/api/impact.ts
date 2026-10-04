import { API_URL } from '../../config/env';


export interface ImpactMetric {
  id: string;
  value: number;
  label: string;
  description?: string;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ImpactResponse {
  success: boolean;
  data: ImpactMetric[];
}

export interface SingleImpactResponse {
  success: boolean;
  data: ImpactMetric;
}

export const fetchImpactMetrics = async (): Promise<ImpactResponse> => {
  const response = await fetch(`${API_URL}/impact`);
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result;
};

export const fetchImpactMetricsAdmin = async (): Promise<ImpactResponse> => {
  const response = await fetch(`${API_URL}/impact/admin/all`, {
    credentials: 'include'
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result;
};

export const createImpactMetric = async (data: Partial<ImpactMetric>): Promise<SingleImpactResponse> => {
  const response = await fetch(`${API_URL}/impact`, {
    method: 'POST',
    credentials: 'include',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result;
};

export const updateImpactMetric = async (id: string, data: Partial<ImpactMetric>): Promise<SingleImpactResponse> => {
  const response = await fetch(`${API_URL}/impact/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result;
};

export const deleteImpactMetric = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_URL}/impact/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result;
};
