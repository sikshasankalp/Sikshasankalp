export const API_BASE_URL = import.meta.env.VITE_API_URL as string;
if (!API_BASE_URL) {
    console.warn('VITE_API_URL is not defined in environment variables.');
}
export const API_URL = `${API_BASE_URL || ''}/api`;
