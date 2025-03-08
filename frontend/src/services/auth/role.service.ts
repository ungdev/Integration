// src/services/role.service.ts
import { decodeToken, getToken } from './auth.service';

export const getRole = (): string | null => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Suppose que le token est un JWT et qu'il contient un payload avec un rôle
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Décodage du token JWT
        return decodedToken?.role || null;  // Retourne le rôle ou null
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        return null;
      }
    }
    return null;
  };

export const isAdmin = (): boolean => {
  return getRole() === 'admin';
};
