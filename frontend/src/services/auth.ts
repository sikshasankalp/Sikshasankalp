import { API_BASE_URL as API_URL } from '../config/env';


export interface LoginRequest {
  email: string;
  password?: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  photoUrl?: string;
}

export const login = async (data: LoginRequest): Promise<User> => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Login failed');
  }
  return result.data.user;
};

export const logout = async (): Promise<void> => {
  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Logout failed');
  }
};

export const checkAuth = async (): Promise<User> => {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });
  
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Authentication failed');
  }
  return result.data.user;
};

export const signup = async (data: SignupRequest): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Signup failed');
  }
  return result;
};
