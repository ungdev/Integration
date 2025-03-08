// src/components/PrivateRoute.tsx
import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../../services/auth/auth.service';
import { isAdmin } from '../../services/auth/role.service';

interface PrivateRouteProps {
  roleRequired?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roleRequired }) => {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" />;
  }

  if (roleRequired && !isAdmin()) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
