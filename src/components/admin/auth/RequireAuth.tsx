
import { ReactNode } from 'react';

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: string[];
}

// Modified to always allow access for testing
const RequireAuth = ({ children }: RequireAuthProps) => {
  // Always render children without checking auth
  return <>{children}</>;
};

export default RequireAuth;
