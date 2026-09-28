export interface DashboardStats {
  totalDonations: string;
  successfulDonations: string;
  volunteers: number;
  contactMessages: number;
  galleryItems: number;
  programs: number;
}

export interface RecentActivity {
  id: string;
  type: 'donation' | 'volunteer' | 'message' | 'gallery';
  title: string;
  time: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
}

export const getDashboardData = async (): Promise<DashboardData> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Future API: GET /api/admin/dashboard
  return {
    stats: {
      totalDonations: '₹1,24,500',
      successfulDonations: '42',
      volunteers: 18,
      contactMessages: 24,
      galleryItems: 156,
      programs: 5
    },
    recentActivity: [
      { id: '1', type: 'donation', title: 'New donation received (₹5,000)', time: '2 hours ago' },
      { id: '2', type: 'volunteer', title: 'New volunteer enquiry (Mumbai)', time: '5 hours ago' },
      { id: '3', type: 'message', title: 'New contact message (Partnership)', time: '1 day ago' },
      { id: '4', type: 'gallery', title: 'Added 12 new gallery items', time: '2 days ago' }
    ]
  };
};
