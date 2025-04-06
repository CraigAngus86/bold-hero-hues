
import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const RequireAuth = ({ children, allowedRoles }: RequireAuthProps) => {
  const { user, hasRole } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login page if not authenticated
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If there are allowed roles and the user doesn't have any of them
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some(role => hasRole(role));
    
    if (!hasRequiredRole) {
      // If user doesn't have the required role, redirect to dashboard
      return <Navigate to="/admin" replace />;
    }
  }

  // User is authenticated and has required roles, render the children
  return <>{children}</>;
};

export default RequireAuth;
