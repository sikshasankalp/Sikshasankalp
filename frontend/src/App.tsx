import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

// Admin Page Imports
import AdminLayout from './admin/layouts/AdminLayout';
import AdminRoute from './admin/components/AdminRoute';
import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import PlaceholderAdminPage from './admin/pages/PlaceholderAdminPage';

function App() {
  return (
    <BrowserRouter>
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
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="gallery" element={<PlaceholderAdminPage title="Gallery Management" />} />
            <Route path="donations" element={<PlaceholderAdminPage title="Donations Management" />} />
            <Route path="programs" element={<PlaceholderAdminPage title="Programs Management" />} />
            <Route path="team" element={<PlaceholderAdminPage title="Team Management" />} />
            <Route path="media" element={<PlaceholderAdminPage title="Media Coverage" />} />
            <Route path="library" element={<PlaceholderAdminPage title="Digital Library" />} />
            <Route path="transparency" element={<PlaceholderAdminPage title="Transparency & Documents" />} />
            <Route path="volunteers" element={<PlaceholderAdminPage title="Volunteers" />} />
            <Route path="partners" element={<PlaceholderAdminPage title="Partners" />} />
            <Route path="messages" element={<PlaceholderAdminPage title="Messages & Enquiries" />} />
            <Route path="settings" element={<PlaceholderAdminPage title="System Settings" />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
