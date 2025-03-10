// src/services/auth.service.ts
import { DecodedToken } from '../../interfaces/token.interfaces';
import api from '../api';
import { jwtDecode } from 'jwt-decode';

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
    localStorage.setItem('authToken', token);

    return token;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la connexion');
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
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

export const isTokenValid = async () =>{
  
  const response = await api.get('auth/istokenvalid/');

  return response?.data.data

  
}
