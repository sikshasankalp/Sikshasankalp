import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Image as ImageIcon, Heart, BookOpen, 
  Users, Radio, Library, ShieldCheck, UserPlus, Handshake, 
  MessageSquare, Settings, LogOut, Menu, X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ADMIN_LINKS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/gallery', icon: ImageIcon, label: 'Gallery' },
  { to: '/admin/donations', icon: Heart, label: 'Donations' },
  { to: '/admin/programs', icon: BookOpen, label: 'Programs' },
  { to: '/admin/team', icon: Users, label: 'Team' },
  { to: '/admin/media', icon: Radio, label: 'Media Coverage' },
  { to: '/admin/library', icon: Library, label: 'Digital Library' },
  { to: '/admin/transparency', icon: ShieldCheck, label: 'Transparency' },
  { to: '/admin/volunteers', icon: UserPlus, label: 'Volunteers' },
  { to: '/admin/partners', icon: Handshake, label: 'Partners' },
  { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' }
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const closeSidebar = () => setIsMobileOpen(false);

  return (
    <div className="flex h-screen bg-surface-muted overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-content-primary/50 z-40 lg:hidden" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-background border-r border-border/50 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border/50">
          <span className="font-display font-bold text-lg text-content-primary truncate">Shiksha Admin</span>
          <button onClick={closeSidebar} className="lg:hidden text-content-secondary hover:text-content-primary">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {ADMIN_LINKS.map(link => {
            const Icon = link.icon;
            return (
              <NavLink 
                key={link.to} 
                to={link.to}
                onClick={closeSidebar}
                className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
                  isActive 
                  ? 'bg-brand-primary/10 text-brand-primary' 
                  : 'text-content-secondary hover:bg-surface hover:text-content-primary'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {link.label}
              </NavLink>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-border/50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="h-16 bg-background border-b border-border/50 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileOpen(true)} className="lg:hidden text-content-secondary hover:text-content-primary">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-content-primary hidden sm:block">Admin Console</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-content-primary">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-content-muted">{user?.role?.replace('_', ' ')}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-surface-muted">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
        
      </div>
    </div>
  );
}
