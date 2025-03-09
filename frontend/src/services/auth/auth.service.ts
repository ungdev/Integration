// src/services/auth.service.ts
import api from '../utils';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: number;
  role: string;
}

export const registerUser = async (firstName: string, lastName: string, email: string, password: string) => {
  try {
    const response = await api.post('/auth/register', { firstName, lastName, email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription');
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const token = response.data.token;

    // Sauvegarder le token dans le localStorage pour le garder pendant la session
    localStorage.setItem('token', token);

    return token;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la connexion');
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const decodeToken = (token: string): DecodedToken => {
  return jwtDecode(token);
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const handleCASTicket = async (ticket: string)=>{
    const response = await api.get('auth/handlecasticket/', {
        params:{
            "ticket" :ticket
        }
    });

    return response?.data.data
}
