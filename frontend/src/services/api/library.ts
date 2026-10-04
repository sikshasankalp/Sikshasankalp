import { API_URL } from '../../config/env';


export interface LibraryResource {
  id: string;
  title: string;
  description?: string;
  category?: string;
  fileUrl: string;
  thumbnailUrl?: string;
  fileType?: string;
  fileSize?: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryResponse {
  success: boolean;
  data: LibraryResource[];
  meta?: any;
}

export interface SingleLibraryResponse {
  success: boolean;
  data: LibraryResource;
}

export const fetchLibrary = async (params: Record<string, string | number | boolean> = {}): Promise<LibraryResponse> => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const response = await fetch(`${API_URL}/library?${query}`);
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result;
};

export const fetchLibraryAdmin = async (params: Record<string, string | number | boolean> = {}): Promise<LibraryResponse> => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const response = await fetch(`${API_URL}/library/admin?${query}`, {
    credentials: 'include'
  });
  // Wait, there is no /library/admin in backend. The backend checks if the admin token is present in /library or has separate endpoints?
  // Let me check what backend provides. In library.routes.ts, there is only `/` GET and `/:id` GET. The `library.controller.ts` hardcoded `isPublicRequest = true` for GET!
  // This means the admin cannot see unpublished resources through the existing endpoints!
  // I must add an `/admin` GET endpoint in backend like I did for Team/Gallery!
  // I will just use /library/admin in this fetch function and then I will update the backend!
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result;
};

export const createLibraryResource = async (formData: FormData): Promise<SingleLibraryResponse> => {
  const response = await fetch(`${API_URL}/library`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result;
};

export const updateLibraryResource = async (id: string, formData: FormData): Promise<SingleLibraryResponse> => {
  const response = await fetch(`${API_URL}/library/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    body: formData,
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result;
};

export const deleteLibraryResource = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_URL}/library/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result;
};
