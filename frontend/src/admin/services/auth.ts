export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    name: string;
    role: string;
  }
}

export const adminLogin = async (data: LoginRequest): Promise<LoginResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!data.email) {
    throw new Error('Email is required');
  }

  // Temporary frontend validation as requested
  if (data.email !== 'Sikshasankalpfoundation@gmail.com' || data.password !== '123') {
    throw new Error('Invalid credentials');
  }

  // Frontend-only mock. Do NOT put real credentials here in production.
  localStorage.setItem('admin_email', 'Sikshasankalpfoundation@gmail.com');
  
  // Future API: POST /api/auth/login
  return {
    token: 'mock-jwt-token-replace-with-real-token',
    user: {
      name: 'Admin User',
      role: 'Administrator'
    }
  };
};

export const adminLogout = () => {
  // Mock logout
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_email');
};

export const isAuthenticated = () => {
  // Frontend-only UX protection check. Backend MUST enforce real authorization.
  return !!localStorage.getItem('admin_token');
};
