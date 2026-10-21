import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '../hooks/useSession';

function RequireAuth({ admin = false, children }) {
  const { isAuthenticated, isAdmin } = useSession();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (admin && !isAdmin()) return <Navigate to="/" replace />;

  return children || <Outlet />;
}

export default RequireAuth;
