import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../services/auth';

export default function AdminRoute() {
  const isAuth = isAuthenticated();
  
  // TODO: Actual authorization must be enforced by the backend once authentication is implemented.
  // This is only UX-level protection.
  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
