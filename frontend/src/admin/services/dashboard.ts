const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface DashboardStats {
  donations: {
    totalAmount: number;
    successfulCount: number;
  };
  volunteers: {
    total: number;
    pending: number;
  };
  gallery: {
    published: number;
  };
  programs: {
    active: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    createdAt: string;
  }>;
}

export const getDashboardData = async (): Promise<DashboardStats> => {
  const response = await fetch(`${API_URL}/api/admin`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  const result = await response.json();
  return result.data;
};
