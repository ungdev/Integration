// src/components/utils/AdminRoute.tsx
import React from "react";
import ProtectedRoute from "./protectedroute";
import PrivateRoute from "./privateroute";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  return (
    <ProtectedRoute>
      <PrivateRoute permissionRequired="Admin">{children}</PrivateRoute>
    </ProtectedRoute>
  );
};

export default AdminRoute;
