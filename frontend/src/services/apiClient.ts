const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let refreshPromise: Promise<boolean> | null = null;

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const mergedOptions: RequestInit = {
    ...options,
    credentials: 'include',
  };

  let response = await fetch(url, mergedOptions);

  if (response.status === 401) {
    if (!refreshPromise) {
      refreshPromise = fetch(`${API_URL}/api/auth/refresh`, {
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
