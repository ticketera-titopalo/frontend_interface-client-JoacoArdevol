import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '../hooks/useSession';

function needsLogin(isAuthenticated) {
  return !isAuthenticated;
}

function needsAdminAccess(admin, isAdmin) {
  return admin && !isAdmin();
}

function RequireAuth({ admin = false, children }) {
  const { isAuthenticated, isAdmin } = useSession();
  const location = useLocation();

  if (needsLogin(isAuthenticated)) return <Navigate to="/login" state={{ from: location }} replace />;
  if (needsAdminAccess(admin, isAdmin)) return <Navigate to="/" replace />;

  return children || <Outlet />;
}

export default RequireAuth;
