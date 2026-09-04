import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, allowedRole = null }) {
  const { isAuthenticated, loading, userRole, getDashboardPath } = useAuth();

  if (loading) return <LoadingSpinner text="Authenticating..." />;

  if (!isAuthenticated) {
    const redirectLogin = allowedRole?.toUpperCase() === 'DONOR' ? '/donor/login' : '/seeker/login';
    return <Navigate to={redirectLogin} replace />;
  }

  // If a specific role is required and user does not match
  if (allowedRole) {
    const normAllowed = allowedRole.toUpperCase();
    const normUserRole = userRole ? userRole.toUpperCase() : 'SEEKER';

    if (normUserRole !== normAllowed) {
      // Redirect to their own role dashboard
      return <Navigate to={getDashboardPath()} replace />;
    }
  }

  return children;
}
