import { Navigate } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';

interface ProtectedRouteProps {
  feature: string;
  action: string;
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  feature,
  action,
  children,
  redirectTo = '/upgrade'
}) => {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(feature, action)) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};