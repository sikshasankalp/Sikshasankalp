export const API_BASE_URL = import.meta.env.VITE_API_URL as string;

if (API_BASE_URL === undefined) {
    throw new Error('FATAL: VITE_API_URL is not defined in environment variables.');
}

const cleanBaseUrl = API_BASE_URL.replace(/\/+$/, '');

export const API_URL = `${cleanBaseUrl}/api`;
