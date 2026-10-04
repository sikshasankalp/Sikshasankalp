import { API_URL } from '../config/env';


let refreshPromise: Promise<boolean> | null = null;

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const mergedOptions: RequestInit = {
    ...options,
    credentials: 'include',
  };

  let response = await fetch(url, mergedOptions);

  if (response.status === 401) {
    if (!refreshPromise) {
      refreshPromise = fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      }).then(res => res.ok).catch(() => false).finally(() => {
        refreshPromise = null;
      });
    }

    const refreshSuccess = await refreshPromise;

    if (refreshSuccess) {
      response = await fetch(url, mergedOptions);
    }
  }

  return response;
}
