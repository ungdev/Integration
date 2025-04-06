// src/services/role.service.ts
import api from '../api';
import { decodeToken, getToken } from './auth.service';

export const getPermission = (): string | null => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // Suppose que le token est un JWT et qu'il contient un payload avec un rôle
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Décodage du token JWT
        return decodedToken?.userPermission || null;  // Retourne le rôle ou null
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        return null;
      }
    }
    return null;
  };

export const isAdmin = (): boolean => {
  return getPermission() === 'Admin';
};


export const getUsers = async () => {
  try{
    const response = await api.get("/user/getusers");
    const users = response.data.data;
  
    return users;
  
  }
  catch(error){
    throw new Error("Error while getting Users" + error);
  }

}

