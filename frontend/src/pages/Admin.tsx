// src/pages/AdminPage.tsx
import React, { useEffect, useState } from 'react';
import {Navbar} from 'src/components/navbar';
import { getRole } from 'src/services/auth/role.service';

const AdminPage: React.FC = () => {

    const [role, setRole] = useState<string | null >(null);
    const [loading, setLoading] = useState<boolean>(true); // Gestion du loading
     // Fonction pour récupérer et vérifier le rôle depuis le token
      useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const userRole = getRole();
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
      <h2>Admin Dashboard</h2>
      <p>Welcome, Admin!</p>
    </div>
  );
};

export default AdminPage;
