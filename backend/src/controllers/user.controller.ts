import type { AdminCreateUserDto, PermissionParams, ProfileBody, SyncBody, UserIdParams } from '../dto/user.dto';
import * as user_service from '../services/user.service';
import { Error, Ok } from '../utils/responses';
import type { AppRequestHandler } from '../types/http';

export const getUsersAdmin: AppRequestHandler = async (_req, res) => {
    try {
        const users = await user_service.getUsersAdmin();
        Ok(res, { data: users });
        return;
    } catch (error) {
        console.error(error);
        Error(res, { msg: 'Erreur interne lors de la récupération des utilisateurs avec leurs rôles.' });
        return;
    }
};

export const getUsers: AppRequestHandler = async (_req, res) => {
    try {
        const users = await user_service.getUsers();
        Ok(res, { data: users });
        return;
    } catch (error) {
        console.error(error);
        Error(res, { msg: 'Erreur interne lors de la récupération des utilisateurs avec leurs rôles.' });
        return;
    }
};

export const getUsersByPermission: AppRequestHandler<unknown, unknown, PermissionParams> = async (req, res) => {
    const { permission } = req.params;

    try {
        const users = await user_service.getUsersbyPermission(permission);
        Ok(res, { data: users });
        return;
    } catch (error) {
        console.error(error);
        Error(res, { msg: 'Erreur interne lors de la récupération des utilisateurs avec leurs rôles.' });
        return;
    }
};

export const syncNewstudent: AppRequestHandler<SyncBody> = async (req, res) => {
    const { date } = req.body;

    try {
        await user_service.syncNewStudents(date);

        Ok(res, {
            msg: 'All NewStudent created and synced',
        });
    } catch (error) {
        Error(res, { error });
    }
};

export const getCurrentUser: AppRequestHandler = async (req, res) => {
    const userId = req.user?.userId;

    try {
        const user = await user_service.getUserById(userId);
        Ok(res, { data: user });
    } catch {
        Error(res, { msg: 'Erreur lors de la mise à jour du profil.' });
    }
};

export const updateProfile: AppRequestHandler<ProfileBody> = async (req, res) => {
    const userId = req.user?.userId;
    const { branch, contact } = req.body;

    try {
        const result = await user_service.updateUserInfoByUserId(userId, branch, contact);
        Ok(res, { msg: 'Profil mis à jour', data: result });
    } catch {
        Error(res, { msg: 'Erreur lors de la mise à jour du profil.' });
    }
};

export const adminUpdateUser: AppRequestHandler<unknown, unknown, UserIdParams> = async (req, res) => {
    const { userId } = req.params;
    const updates = req.body;

    try {
        const result = await user_service.updateUserByAdmin(parseInt(userId), updates);
        Ok(res, { msg: 'Utilisateur mis à jour', data: result });
    } catch {
        Error(res, { msg: "Erreur lors de la mise à jour de l'utilisateur." });
    }
};

export const adminCreateUser: AppRequestHandler<AdminCreateUserDto> = async (req, res) => {
    try {
        const user = await user_service.adminCreateUser(req.body);

        Ok(res, {
            msg: 'Utilisateur créé',
            data: user,
        });
    } catch (err) {
        Error(res, { msg: err.message });
    }
};

export const adminDeleteUser: AppRequestHandler<unknown, unknown, UserIdParams> = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await user_service.deleteUserById(parseInt(userId));
        Ok(res, { msg: 'Utilisateur supprimé', data: result });
    } catch {
        Error(res, { msg: "Erreur lors de la suppression de l'utilisateur." });
    }
};
