import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, isAdmin, loading } = useAuth();

  console.log('ProtectedRoute:', { 
    isAuthenticated: !!user, 
    isAdmin, 
    requireAdmin,
    userEmail: user?.email,
    loading
  });

  // Show nothing while loading
  if (loading) {
    return null;
  }

  // Redirect to home if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if admin access is required but user is not admin
  if (requireAdmin && !isAdmin) {
    console.log('Admin access denied:', { userEmail: user.email });
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default ProtectedRoute; 