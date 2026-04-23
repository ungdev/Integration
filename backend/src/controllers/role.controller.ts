import { type Request, type Response } from "express";
import * as role_service from "../services/role.service";
import { Error, Ok } from "../utils/responses";

// 🎯 Préférences utilisateur
export const updateUserPreferences = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { roleIds } = req.body;

        if (!userId || !Array.isArray(roleIds)) {
            Error(res, { msg: "Données invalides" });
        }

        await role_service.updateUserPreferences(userId, roleIds);
        Ok(res, { msg: "Préférences mises à jour avec succès" });
    } catch (error) {
        console.error(error);
        Error(res, { msg: "Erreur interne serveur" });
    }
};

export const getUserPreferences = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) Error(res, { msg: "Utilisateur non authentifié" });

        const preferences = await role_service.getUserPreferences(userId);
        const roleIds = preferences.map((pref) => pref.roleId);
        Ok(res, { msg: "Préférences récupérées", data: roleIds });
    } catch (error) {
        console.error(error);
        Error(res, { msg: "Erreur interne serveur" });
    }
};

// 👥 Utilisateurs par rôle
export const getUsersByRoleHandler = async (req: Request, res: Response) => {
    try {
        const { roleName } = req.params;
        if (!roleName) Error(res, { msg: "Nom du rôle requis" });

        const users = await role_service.getUsersByRoleName(roleName);
        Ok(res, { msg: "Utilisateurs récupérés", data: users });
    } catch (error) {
        console.error(error);
        Error(res, { msg: "Erreur interne serveur" });
    }
};

// ➕ Ajouter rôle à utilisateur
export const addRoleToUser = async (req: Request, res: Response) => {
    try {
        const { userId, roleIds } = req.body;

        if (!userId || !Array.isArray(roleIds)) {
            Error(res, { msg: "userId et roleIds requis" });
        }

        for (const roleId of roleIds) {
            const exists = await role_service.checkRoleUser(userId, roleId);
            if (exists.length === 0) {
                await role_service.insertUserRole(userId, roleId);
            }
        }

        Ok(res, { msg: "Rôles ajoutés avec succès" });
    } catch (error) {
        console.error(error);
        Error(res, { msg: "Erreur lors de l'ajout des rôles" });
    }
};

// ❌ Supprimer rôle d'un utilisateur
export const deleteRoleToUser = async (req: Request, res: Response) => {
    try {
        const { userId, roleId } = req.body;

        if (!userId || !roleId) {
            Error(res, { msg: "userId et roleId requis" });
        }

        await role_service.removeRoleFromUser(userId, roleId);
        Ok(res, { msg: "Rôle supprimé avec succès" });
    } catch (error) {
        console.error(error);
        Error(res, { msg: "Erreur lors de la suppression du rôle" });
    }
};

// 📋 Utilisateurs avec leurs rôles
export const getUsersWithRoles = async (req: Request, res: Response) => {
    try {
        const users = await role_service.getUsersWithRoles();
        Ok(res, { data: users });
    } catch (error) {
        console.error(error);
        Error(res, { msg: "Erreur lors de la récupération des utilisateurs" });
    }
};

// 📦 Tous les rôles
export const getRoles = async (req: Request, res: Response) => {
    try {
        const roles = await role_service.getRoles();
        Ok(res, { data: roles });
    } catch (error) {
        console.error(error);
        Error(res, { msg: "Erreur lors de la récupération des rôles" });
    }
};

// 🔍 Rôles d'un utilisateur
export const getUserRoles = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;
        if (!userId) Error(res, { msg: "userId requis" });

        const roles = await role_service.getUserRoles(Number(userId));
        Ok(res, { data: roles });
    } catch (error) {
        console.error(error);
        Error(res, { msg: "Erreur lors de la récupération des rôles utilisateur" });
    }
};

//
// 🧮 Gestion des points de rôle
//

// ➕ Ajouter des points
export const addPointsToRole = async (req: Request, res: Response) => {
    try {
        const { roleId, points } = req.body;

        if (!roleId || typeof points !== "number") {
            Error(res, { msg: "roleId et points requis" });
        }

        await role_service.addPointsToRole(roleId, points);
        Ok(res, { msg: "Points ajoutés avec succès" });
    } catch (error) {
        console.error(error);
        Error(res, { msg: "Erreur lors de l'ajout des points" });
    }
};

// ➖ Retirer des points
export const removePointsFromRole = async (req: Request, res: Response) => {
    try {
        const { roleId, points } = req.body;

        if (!roleId || typeof points !== "number") {
            Error(res, { msg: "roleId et points requis" });
        }

        await role_service.removePointsFromRole(roleId, points);
        Ok(res, { msg: "Points retirés avec succès" });
    } catch (error) {
        console.error(error);
        Error(res, { msg: "Erreur lors du retrait des points" });
    }
};

// 📊 Points de tous les rôles
export const getAllRolePoints = async (_req: Request, res: Response) => {
    try {
        const roles = await role_service.getAllRolePoints();
        Ok(res, { data: roles });
    } catch (error) {
        console.error(error);
        Error(res, { msg: "Erreur lors de la récupération des points" });
    }
};

// 🔍 Points d'un rôle spécifique
export const getRolePoints = async (req: Request, res: Response) => {
    try {
        const { roleId } = req.params;
        if (!roleId) Error(res, { msg: "roleId requis" });

        const role = await role_service.getRolePoints(Number(roleId));
        if (!role) Error(res, { msg: "Rôle introuvable" });

        Ok(res, { data: role });
    } catch (error) {
        console.error(error);
        Error(res, { msg: "Erreur lors de la récupération des points du rôle" });
    }
};
