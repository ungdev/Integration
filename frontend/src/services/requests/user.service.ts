// src/services/role.service.ts
import { User } from '../../interfaces/user.interface';
import api from '../api';

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
    const response = await api.get("/user/user/getusers");
    const users = response.data.data;
  
    return users;
  
  }
  catch(error){
    throw new Error("Error while getting Users" + error);
  }

}

export const getUsersByPermission = async () => {
  try{
    const response = await api.get("/user/admin/getusersbypermission");
    const users = response.data.data;
  
    return users;
  
  }
  catch(error){
    throw new Error("Error while getting Users" + error);
  }

}

export const getCurrentUser = async () => {
  const res = await api.get("/user/user/me"); 

  return res.data.data;
};

export const updateCurrentUser = async (data: Partial<User>) => {
  try{
    const response = await api.patch("/user/user/me", data);
    return response.data

  }catch(error : any){
    return error.response.data;
  }
};

export const updateUserByAdmin = async (id: number, data: Partial<User>) => {
  try{
    
    const response = await api.patch(`/user/admin/user/${id}`, data);
    return response.data

  }catch(error : any){
    return error.response.data;
  }
};

export const deleteUserByAdmin = async (id: number) => {

  try{
    const response = await api.delete(`/user/admin/user/${id}`);
    return response.data

  }catch(error : any){
    return error.response.data;
  }
};

export const syncnewStudent = async (date: string) => {

  try{
    const response = await api.post(`/user/admin/syncnewstudent/`,{date});
    return response.data

  }catch(error : any){
    return error.response.data;
  }
};
