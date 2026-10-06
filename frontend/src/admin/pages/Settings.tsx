import { useAuth } from '../../context/AuthContext';
import { Shield, Mail, Phone, MapPin, Database, Cloud, CheckCircle, Info } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-content-primary">System &amp; Admin Settings</h1>
        <p className="text-sm text-content-secondary mt-1">
          Manage administrator account settings, foundation credentials, and system integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Administrator Profile */}
        <div className="bg-background border border-border/60 rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-border/50">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-content-primary">Administrator Profile</h2>
              <p className="text-xs text-content-secondary">Current logged-in account details</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-content-muted uppercase font-bold tracking-wider">Account Name</span>
              <p className="font-medium text-content-primary">{user?.name || 'Shiksha Sankalp Admin'}</p>
            </div>
            <div>
              <span className="text-xs text-content-muted uppercase font-bold tracking-wider">Email Address</span>
              <p className="font-medium text-content-primary">{user?.email || 'sikshasankalpfoundation@gmail.com'}</p>
            </div>
            <div>
              <span className="text-xs text-content-muted uppercase font-bold tracking-wider">Role &amp; Permissions</span>
              <div className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  {user?.role || 'SUPER_ADMIN'}
                </span>
              </div>
            </div>
            <div>
              <span className="text-xs text-content-muted uppercase font-bold tracking-wider">Security Status</span>
              <p className="text-xs text-green-600 font-semibold flex items-center gap-1.5 mt-0.5">
                <CheckCircle className="w-4 h-4" /> Two-Factor / JWT Token Auth Active
              </p>
            </div>
          </div>
        </div>

        {/* Foundation Official Details */}
        <div className="bg-background border border-border/60 rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-border/50">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-content-primary">Registered NGO Details</h2>
              <p className="text-xs text-content-secondary">Official NGO address &amp; contact lines</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-content-muted uppercase font-bold">Registered Office</span>
                <p className="text-xs text-content-primary font-medium leading-relaxed mt-0.5">
                  KH-103, Alawardi Pur, Near Durga Mandir, Gautam Buddha Nagar, Uttar Pradesh – 201308
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-brand-primary shrink-0" />
              <div>
                <span className="text-xs text-content-muted uppercase font-bold">Official Email</span>
                <p className="text-xs text-content-primary font-medium">sikshasankalpfoundation@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-brand-primary shrink-0" />
              <div>
                <span className="text-xs text-content-muted uppercase font-bold">Official Hotline</span>
                <p className="text-xs text-content-primary font-medium">+91 89207 65376 / +91 82878 43477</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Services & Integrations */}
      <div className="bg-background border border-border/60 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-content-primary text-base">Connected Cloud Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-surface-muted/40 border border-border/60">
            <div className="flex items-center gap-2 text-content-primary font-semibold text-sm mb-1">
              <Cloud className="w-4 h-4 text-brand-primary" /> Cloudinary Media
            </div>
            <p className="text-xs text-content-secondary">Cloud: uu0beytj</p>
            <span className="inline-block mt-2 text-xs font-semibold text-green-600">● Connected (25MB Limit)</span>
          </div>

          <div className="p-4 rounded-lg bg-surface-muted/40 border border-border/60">
            <div className="flex items-center gap-2 text-content-primary font-semibold text-sm mb-1">
              <Database className="w-4 h-4 text-brand-primary" /> PostgreSQL Database
            </div>
            <p className="text-xs text-content-secondary">Hosted on Render Cloud</p>
            <span className="inline-block mt-2 text-xs font-semibold text-green-600">● Operational</span>
          </div>

          <div className="p-4 rounded-lg bg-surface-muted/40 border border-border/60">
            <div className="flex items-center gap-2 text-content-primary font-semibold text-sm mb-1">
              <Mail className="w-4 h-4 text-brand-primary" /> Brevo HTTPS Email
            </div>
            <p className="text-xs text-content-secondary">API Delivery (Port 443)</p>
            <span className="inline-block mt-2 text-xs font-semibold text-green-600">● Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
