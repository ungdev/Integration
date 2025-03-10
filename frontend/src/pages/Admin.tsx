import React, { useEffect, useState } from 'react';
import { AdminRoleManagement, AdminRolePreferences } from 'src/components/Admin/adminRole';
import { Navbar } from 'src/components/navbar';
import { getPermission } from 'src/services/requests/user.service';

export const AdminPage: React.FC = () => {

    const [role, setRole] = useState<string | null >(null);
    const [loading, setLoading] = useState<boolean>(true); // Gestion du loading

    // Fonction pour récupérer et vérifier le rôle depuis le token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const userRole = getPermission();
            setRole(userRole);  // Met à jour le rôle de l'utilisateur
        }
        setLoading(false); // Arrêt du loading une fois l'opération terminée
    }, []);
    
    // Rendu conditionnel pendant le chargement
    if (loading) {
        return <div>Chargement...</div>;
    }

  return (
    <div>
        <Navbar/>
        <div className="flex flex-col md:flex-row justify-between gap-6 p-6">
            <div className="w-full md:w-1/2 h-full flex flex-col"> {/* 50% largeur, 100% hauteur, flex-col pour les enfants */}
                <div className="h-full">
                    <AdminRolePreferences />
                </div>
            </div>
            <div className="w-full md:w-1/2 h-full flex flex-col"> {/* 50% largeur, 100% hauteur, flex-col pour les enfants */}
                <div className="h-full">
                    <AdminRoleManagement />
                </div>
            </div>
        </div>
    </div>
  );
};
