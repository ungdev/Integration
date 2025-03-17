import { Request, Response } from "express";
import { Error, Ok } from "../utils/responses";
import * as role_service from '../services/role.service'

export const updateUserPreferences = async (req: Request, res: Response) => {
    try {
      const userId = req.user.userId; // Assurez-vous que l'auth middleware ajoute l'ID utilisateur
      const { roleIds } = req.body; // Liste des ID des rôles sélectionnés

      if (!Array.isArray(roleIds)) {
        res.status(400).json({ message: "Invalid data format" });
        return;
      }

      await role_service.updateUserPreferences(userId , roleIds);
  
      Ok(res,{ msg: "Preferences updated successfully" });
      return;

    } catch (error) {
      console.error(error);
      Error(res, { msg: "Internal server error" });
      return;
    }
};

export const getUserPreferences = async (req: Request, res: Response) => {
    try {
      const userId = req.user.userId; // Assurez-vous que l'auth middleware ajoute l'ID utilisateur
  
      const userPreferences = await role_service.getUserPreferences(userId);
      
      // Extraire uniquement les roleId
      const roleIds = userPreferences.map((preference) => preference.roleId);
  
      Ok(res, { msg: "Preferences retrieved successfully", data: roleIds });
      return;
  
    } catch (error) {
      console.error(error);
      Error(res, { msg: "Internal server error" });
      return;
    }
};

// Contrôleur pour récupérer les utilisateurs par rôle
export const getUsersByRoleHandler = async (req: Request, res: Response) => {
    try {
      const { roleName } = req.params; // Récupérer le nom du rôle depuis l'URL
      const usersWithRole = await role_service.getUsersByRole(roleName);
  
      // Renvoyer les résultats
      Ok(res, { msg: "Utilisateurs récupérés", data: usersWithRole });
    } catch (error) {
      console.error(error);
      Error(res, { msg: "Erreur interne du serveur" });
    }
  };

  // Contrôleur pour ajouter un rôle à un utilisateur
export const addRoleToUser = async (req: Request, res: Response) => {
    try {
      const { userId, roleIds } = req.body; // Récupère l'ID de l'utilisateur et l'ID du rôle à ajouter
  
      for(const roleId of roleIds){
            // Vérifie si le rôle existe déjà pour cet utilisateur
            const existingRole = await role_service.checkRoleUser(userId, roleId);
            
            // Si le rôle n'existe pas, ajoute-le
            if (existingRole.length === 0) {
                await role_service.insertUserRole(userId, roleId);
            }
        }
      Ok(res,{ msg: 'Rôle ajouté avec succès' });
      return;
    } catch (error) {
      console.error(error);
      Error(res,{ msg: 'Une erreur est survenue' });
      return;
    }
};

export const deleteRoleToUser = async (req: Request, res: Response) => {
    try {
        const { userId, roleIds } = req.body;

        if (!userId || !roleIds) {
           Error(res,{ msg: "userId and roleIds are required" });
           return;
        }
        for (const roleId of roleIds) {
          await role_service.removeRoleFromUser(userId, roleId); // Fonction qui supprime un rôle
        }
          Ok(res,{ msg: "Rôle supprimé avec succès." });
          return;

    } catch (error) {
      console.error(error);
      Error(res,{ msg: 'Une erreur est survenue' });
      return;
    }
};

export const getUsersWithRoles = async (req: Request, res: Response) => {
    try {
        const usersWithRoles = await role_service.getUsersWithRoles();
        Ok(res,{ data: usersWithRoles });
        return;
      } catch (error) {
        console.error(error);
        Error(res,{ msg: "Erreur interne lors de la récupération des utilisateurs avec leurs rôles." });
        return;
      }
};

export const getRoles = async (req: Request, res: Response) => {
    try {
      const roles = await role_service.getRoles()
      Ok(res,({data:roles})); // Renvoie les rôles dans la réponse
      return;

    } catch (error) {
      console.error("Erreur lors de la récupération des rôles", error);
      Error(res,{ msg: "Erreur serveur" });
      return;
    }
  };
  
  