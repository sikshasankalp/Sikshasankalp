const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

export interface Volunteer {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  city?: string;
  skills?: string;
  interests?: string;
  message?: string;
  status: 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface VolunteerResponse {
  success: boolean;
  data: Volunteer[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const fetchVolunteersAdmin = async (params: Record<string, string | number | boolean> = {}): Promise<VolunteerResponse> => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const response = await fetch(`${API_URL}/volunteers?${query}`, {
    credentials: 'include'
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to fetch volunteers');
  return result;
};

export const updateVolunteerStatus = async (id: string, status: string): Promise<Volunteer> => {
  const response = await fetch(`${API_URL}/volunteers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status }),
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to update volunteer status');
  return result.data;
};

export const deleteVolunteer = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/volunteers/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to delete volunteer');
};
