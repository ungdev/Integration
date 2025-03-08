import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import { getRole } from '../services/auth/role.service';

const HomePage: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
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
      <Navbar role={role} />
      <h1>Bienvenue sur la page d'accueil !</h1>
      <p>
        {role === 'admin'
          ? 'Vous avez un accès administrateur.'
          : 'Vous êtes un utilisateur standard.'}
      </p>
    </div>
  );
};

export default HomePage;
