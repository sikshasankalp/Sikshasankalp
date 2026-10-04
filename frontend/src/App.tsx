import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import PublicLayout from './layouts/PublicLayout';

// Page Imports
import Home from './pages/Home';
import About from './pages/About';
import Story from './pages/Story';
import Programs from './pages/Programs';
import Impact from './pages/Impact';
import DigitalLibrary from './pages/DigitalLibrary';
import Media from './pages/Media';
import Gallery from './pages/Gallery';
import Team from './pages/Team';
import Transparency from './pages/Transparency';
import GetInvolved from './pages/GetInvolved';
import PartnerWithUs from './pages/PartnerWithUs';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import MyDonations from './pages/MyDonations';

// Admin Page Imports
import AdminLayout from './admin/layouts/AdminLayout';
import AdminRoute from './admin/components/AdminRoute';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './admin/pages/Dashboard';
import PlaceholderAdminPage from './admin/pages/PlaceholderAdminPage';
import MediaManagement from './admin/pages/MediaManagement';
import TeamManagement from './admin/pages/TeamManagement';
import LibraryManagement from './admin/pages/LibraryManagement';
import ImpactManagement from './admin/pages/ImpactManagement';
import DonationsManagement from './admin/pages/DonationsManagement';
import ProgramsManagement from './admin/pages/ProgramsManagement';
import TransparencyManagement from './admin/pages/TransparencyManagement';
import VolunteersManagement from './admin/pages/VolunteersManagement';
import PartnersManagement from './admin/pages/PartnersManagement';
import MessagesManagement from './admin/pages/MessagesManagement';

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
          <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/our-story" element={<Story />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/digital-library" element={<DigitalLibrary />} />
          <Route path="/media" element={<Media />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/team" element={<Team />} />
          <Route path="/transparency" element={<Transparency />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/partner-with-us" element={<PartnerWithUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/account/donations" element={<MyDonations />} />
        </Route>

          <Route path="/login" element={<LoginRoute />} />
          <Route path="/register" element={<RegisterRoute />} />

          {/* Admin Routes */}
        
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="gallery" element={<MediaManagement />} />
            <Route path="donations" element={<DonationsManagement />} />
            <Route path="programs" element={<ProgramsManagement />} />
            <Route path="impact" element={<ImpactManagement />} />
            <Route path="team" element={<TeamManagement />} />
            <Route path="media" element={<MediaManagement />} />
            <Route path="library" element={<LibraryManagement />} />
            <Route path="transparency" element={<TransparencyManagement />} />
            <Route path="volunteers" element={<VolunteersManagement />} />
            <Route path="partners" element={<PartnersManagement />} />
            <Route path="messages" element={<MessagesManagement />} />
            <Route path="settings" element={<PlaceholderAdminPage title="System Settings" />} />
          </Route>
        </Route>
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

function LoginRoute() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  
  if (user) {
    if (['SUPER_ADMIN', 'CONTENT_ADMIN', 'FINANCE_ADMIN'].includes(user.role)) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Login />;
}

function RegisterRoute() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  
  if (user) {
    if (['SUPER_ADMIN', 'CONTENT_ADMIN', 'FINANCE_ADMIN'].includes(user.role)) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Register />;
}

export default App;
