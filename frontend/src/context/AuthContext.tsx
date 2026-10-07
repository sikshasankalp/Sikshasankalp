import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { checkAuth, login as apiLogin, logout as apiLogout, type LoginRequest, type LoginResult } from '../services/auth';

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

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<LoginResult>;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const userData = await checkAuth();
      setUser(userData);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    async function initAuth() {
      try {
        const userData = await checkAuth();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (data: LoginRequest): Promise<LoginResult> => {
    const res = await apiLogin(data);
    if (!res.requireOtp) {
      setUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
    }
  };

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'CONTENT_ADMIN' || user?.role === 'FINANCE_ADMIN';

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, login, logout, refreshUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
