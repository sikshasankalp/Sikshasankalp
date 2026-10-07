import { API_URL } from '../config/env';


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
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  photoUrl?: string;
  hasPassword?: boolean;
}

const parseResponse = async (response: Response) => {
  let result;
  try {
    result = await response.json();
  } catch (err) {
    if (!response.ok) {
      throw new Error(`Server returned ${response.status} ${response.statusText}`);
    }
    throw new Error('Invalid response from server');
  }
  
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Request failed');
  }
  
  return result;
};

export const login = async (data: LoginRequest): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  
  const result = await parseResponse(response);
  return result.data.user;
};

export const logout = async (): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  
  await parseResponse(response);
};

export const checkAuth = async (): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });
  
  const result = await parseResponse(response);
  return result.data.user;
};

export const signup = async (data: SignupRequest): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return await parseResponse(response);
};

export const setPassword = async (data: { password: string; confirmPassword: string }): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_URL}/auth/password/set`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  return await parseResponse(response);
};

export const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_URL}/auth/password/forgot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  return await parseResponse(response);
};

export const resetPassword = async (data: { token: string; newPassword: string }): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_URL}/auth/password/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return await parseResponse(response);
};
