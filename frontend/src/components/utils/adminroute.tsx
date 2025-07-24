// src/components/utils/AdminRoute.tsx
import React from "react";
import { decodeToken, getToken } from "../../services/requests/auth.service";
import { DecodedToken } from "../../interfaces/token.interfaces";
import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const token = getToken();
  if (!token) return <Navigate to="/" />;

  let decoded: DecodedToken;
  try {
    decoded = decodeToken(token);
  } catch {
    return <Navigate to="/" />;
  }

  if (decoded.userPermission !== "Admin") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AdminRoute