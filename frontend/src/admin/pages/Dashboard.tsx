import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardData } from '../services/dashboard';
import type { DashboardData } from '../services/dashboard';
import { 
  Heart, Users, Image as ImageIcon, 
  BookOpen, Plus, Activity
} from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDashboardData();
        setData(result);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-content-primary mb-1">Dashboard Overview</h2>
        <p className="text-sm text-content-secondary">
          Welcome back. Here's a snapshot of operations (Mock Data ready for API integration).
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        
        <div className="bg-background border border-border/50 p-5 rounded-xl flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <p className="text-xs font-bold text-content-muted uppercase tracking-wider mb-1">Total Donations</p>
            <p className="text-2xl font-bold text-content-primary">{data.stats.totalDonations}</p>
            <p className="text-xs text-content-secondary mt-1">{data.stats.successfulDonations} successful</p>
          </div>
        </div>

        <div className="bg-background border border-border/50 p-5 rounded-xl flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-content-muted uppercase tracking-wider mb-1">Volunteers</p>
            <p className="text-2xl font-bold text-content-primary">{data.stats.volunteers}</p>
            <p className="text-xs text-content-secondary mt-1">Pending enquiries</p>
          </div>
        </div>

        <div className="bg-background border border-border/50 p-5 rounded-xl flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <ImageIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-content-muted uppercase tracking-wider mb-1">Gallery</p>
            <p className="text-2xl font-bold text-content-primary">{data.stats.galleryItems}</p>
            <p className="text-xs text-content-secondary mt-1">Published items</p>
          </div>
        </div>

        <div className="bg-background border border-border/50 p-5 rounded-xl flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-content-muted uppercase tracking-wider mb-1">Programs</p>
            <p className="text-2xl font-bold text-content-primary">{data.stats.programs}</p>
            <p className="text-xs text-content-secondary mt-1">Active programs</p>
          </div>
        </div>

      </div>

      <div className="grid lg:grid-cols-[6fr_4fr] gap-6 md:gap-8">
        
        {/* Recent Activity */}
        <div className="bg-background border border-border/50 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-border/50 flex justify-between items-center">
            <h3 className="text-base font-bold text-content-primary">Recent Activity (Demo)</h3>
            <Activity className="w-4 h-4 text-content-muted" />
          </div>
          <div className="divide-y divide-border/50">
            {data.recentActivity.map(activity => (
              <div key={activity.id} className="p-4 px-6 hover:bg-surface-muted/30 transition-colors flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-content-primary">{activity.title}</span>
                  <span className="text-xs text-content-muted mt-0.5 uppercase tracking-wider">{activity.type}</span>
                </div>
                <span className="text-xs text-content-secondary shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-background border border-border/50 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
          <div className="px-6 py-4 border-b border-border/50">
            <h3 className="text-base font-bold text-content-primary">Quick Actions</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/admin/gallery" className="flex items-center gap-2 p-3 border border-border/60 rounded-lg hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all text-sm font-medium text-content-primary">
              <Plus className="w-4 h-4 text-brand-primary" /> Add Gallery Image
            </Link>
            <Link to="/admin/programs" className="flex items-center gap-2 p-3 border border-border/60 rounded-lg hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all text-sm font-medium text-content-primary">
              <Plus className="w-4 h-4 text-brand-primary" /> Add Program
            </Link>
            <Link to="/admin/library" className="flex items-center gap-2 p-3 border border-border/60 rounded-lg hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all text-sm font-medium text-content-primary">
              <Plus className="w-4 h-4 text-brand-primary" /> Upload Resource
            </Link>
            <Link to="/admin/donations" className="flex items-center gap-2 p-3 border border-border/60 rounded-lg hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all text-sm font-medium text-content-primary">
              <Heart className="w-4 h-4 text-brand-primary" /> View Donations
            </Link>
            <Link to="/admin/volunteers" className="flex items-center gap-2 p-3 border border-border/60 rounded-lg hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all text-sm font-medium text-content-primary sm:col-span-2">
              <Users className="w-4 h-4 text-brand-primary" /> View Volunteer Enquiries
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
