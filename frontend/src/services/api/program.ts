const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

export interface Program {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  imageUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramResponse {
  success: boolean;
  data: Program[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const fetchPrograms = async (params: Record<string, string | number | boolean> = {}): Promise<ProgramResponse> => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const response = await fetch(`${API_URL}/programs?${query}`);
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to fetch programs');
  return result;
};

export const fetchProgramsAdmin = async (params: Record<string, string | number | boolean> = {}): Promise<ProgramResponse> => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const response = await fetch(`${API_URL}/programs/admin?${query}`, {
    credentials: 'include'
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to fetch programs');
  return result;
};

export const createProgram = async (formData: FormData): Promise<Program> => {
  const response = await fetch(`${API_URL}/programs`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to create program');
  return result.data;
};

export const updateProgram = async (id: string, formData: FormData): Promise<Program> => {
  const response = await fetch(`${API_URL}/programs/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    body: formData,
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to update program');
  return result.data;
};

export const deleteProgram = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/programs/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to delete program');
};
