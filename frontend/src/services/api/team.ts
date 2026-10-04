import { API_URL } from '../../config/env';


export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  bio?: string;
  responsibilities?: string;
  expertise?: string;
  department?: string;
  photoUrl?: string;
  displayOrder: number;
  isActive: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamResponse {
  success: boolean;
  data: TeamMember[];
  meta?: any;
}

export const fetchTeam = async (params: Record<string, string | number | boolean> = {}): Promise<TeamResponse> => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const response = await fetch(`${API_URL}/team?${query}`);
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result;
};

export const fetchTeamAdmin = async (params: Record<string, string | number | boolean> = {}): Promise<TeamResponse> => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const response = await fetch(`${API_URL}/team/admin?${query}`, {
    credentials: 'include'
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result;
};

export const createTeamMember = async (formData: FormData): Promise<TeamMember> => {
  const response = await fetch(`${API_URL}/team`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result.data;
};

export const updateTeamMember = async (id: string, formData: FormData): Promise<TeamMember> => {
  const response = await fetch(`${API_URL}/team/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    body: formData,
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result.data;
};

export const deleteTeamMember = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/team/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
};
