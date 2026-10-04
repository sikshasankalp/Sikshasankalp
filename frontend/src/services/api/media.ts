const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

export interface MediaCoverageItem {
  id: string;
  title: string;
  publication: string;
  description?: string;
  thumbnailUrl?: string;
  externalUrl: string;
  category?: string;
  displayLocation?: string;
  publishedAt?: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
}

export const fetchMedia = async (params: Record<string, string | boolean> = {}): Promise<MediaCoverageItem[]> => {
  const { admin, ...restParams } = params;
  const query = new URLSearchParams(restParams as Record<string, string>).toString();
  const endpoint = admin ? `${API_URL}/media/admin` : `${API_URL}/media`;
  const response = await fetch(`${endpoint}?${query}`, {
    credentials: admin ? 'include' : 'omit'
  });
  const result = await response.json();
  return result.data || [];
};

export const createMediaItem = async (formData: FormData): Promise<MediaCoverageItem> => {
  const response = await fetch(`${API_URL}/media`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result.data;
};

export const updateMediaItem = async (id: string, formData: FormData): Promise<MediaCoverageItem> => {
  const response = await fetch(`${API_URL}/media/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    body: formData,
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result.data;
};

export const deleteMediaItem = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/media/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
};
