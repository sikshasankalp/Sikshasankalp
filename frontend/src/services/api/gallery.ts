const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

export interface GalleryItem {
  id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  category?: string;
  displayLocation?: string;
  eventDate?: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
}

export const fetchGallery = async (params: Record<string, string | boolean> = {}): Promise<GalleryItem[]> => {
  const { admin, ...restParams } = params;
  const query = new URLSearchParams(restParams as Record<string, string>).toString();
  const endpoint = admin ? `${API_URL}/gallery/admin` : `${API_URL}/gallery`;
  const response = await fetch(`${endpoint}?${query}`, {
    credentials: admin ? 'include' : 'omit'
  });
  const result = await response.json();
  return result.data || [];
};

export const createGalleryItem = async (formData: FormData): Promise<GalleryItem> => {
  const response = await fetch(`${API_URL}/gallery`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result.data;
};

export const updateGalleryItem = async (id: string, formData: FormData): Promise<GalleryItem> => {
  const response = await fetch(`${API_URL}/gallery/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    body: formData,
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result.data;
};

export const deleteGalleryItem = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/gallery/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
};
