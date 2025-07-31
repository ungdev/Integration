// src/components/PrivateRoute.tsx
import React from 'react';
import {  Navigate } from 'react-router-dom';
import { decodeToken, getToken } from '../../services/requests/auth.service';
import { DecodedToken } from '../../interfaces/token.interfaces';

interface PrivateRouteProps {
  permissionRequired?: string;
  roleRequired?: string;
  children: React.ReactNode;
}


const PrivateRoute: React.FC<PrivateRouteProps> = ({
  permissionRequired,
  roleRequired,
  children,
}) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/" />;
  }

  let decoded: DecodedToken;
  try {
    decoded = decodeToken(token);
  } catch (err) {
    return <Navigate to="/" />;
  }

  const isAdmin = decoded.userPermission === "Admin";

  const hasPermission =
    !permissionRequired || decoded.userPermission === permissionRequired;

  const hasRole =
    !roleRequired ||
    decoded.userRoles?.some((role) => role.roleName === roleRequired);

  if (!isAdmin && !(hasPermission || hasRole)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
