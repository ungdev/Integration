import { AdminRoleManagement, AdminRolePreferences } from "src/components/Admin/adminRole";
import { AdminShotgun } from "src/components/Admin/adminEvent";
import { AdminTeamManagement } from "src/components/Admin/adminTeam";  // Importer le composant
import { Navbar } from "src/components/navbar";
import { getPermission } from "src/services/requests/user.service";
import { Card, CardContent, CardHeader, CardTitle } from "../styles/components/ui/card";
import { useEffect, useState } from "react";

export const AdminPage: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userRole = getPermission();
      setRole(userRole);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gestion des Rôles */}
        <AdminRolePreferences />
        <AdminRoleManagement />

        {/* Gestion du Shotgun */}
        <AdminShotgun />

        {/* Gestion des Équipes */}
        <AdminTeamManagement />
      </div>
    </div>
  );
};
