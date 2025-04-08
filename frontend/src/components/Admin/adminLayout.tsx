// src/components/Admin/AdminLayout.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPermission } from "src/services/requests/user.service";
import { Navbar } from "../navbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = getPermission();

    if (!token || userRole !== "Admin") {
      navigate("/"); // Redirige si non admin
    } else {
      setRole(userRole);
    }

    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
};
