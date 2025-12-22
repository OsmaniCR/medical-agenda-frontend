import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, checkToken } = useAuthStore();

  if (!isAuthenticated || !checkToken()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

