// src/components/Utils/ProtectedRoutes.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import {useAuth} from '../../utils/utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  
  const isAuthenticated = useAuth();

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Ou un spinner de chargement
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
