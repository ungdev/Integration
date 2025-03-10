// src/components/PrivateRoute.tsx
import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../../services/requests/auth.service';
import { isAdmin } from '../../services/requests/user.service';

interface PrivateRouteProps {
  roleRequired?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roleRequired }) => {
  const token = getToken();
  if (!token) {
    return <Navigate to="/" />;
  }

  if (roleRequired && !isAdmin()) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
