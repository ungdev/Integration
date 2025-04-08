// src/components/PrivateRoute.tsx
import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../../services/requests/auth.service';
import { isAdmin } from '../../services/requests/user.service';

interface PrivateRouteProps {
  permissionRequired: string;
  children: React.ReactNode; // 👈 Ajoute ça
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ permissionRequired, children }) => {
  
  const token = getToken();
  if (!token) {
    return <Navigate to="/" />;
  }

  if (permissionRequired && !isAdmin()) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
