import bcrypt from 'bcryptjs';
import { type Request, type Response } from 'express';
import * as randomstring from 'randomstring';
import * as auth_service from '../services/auth.service';
import * as user_service from '../services/user.service';
import { noSyncEmails } from '../utils/no_sync_list';
import { Error, Ok } from '../utils/responses';
import * as SIEP_Utils from '../utils/siep';
import { type UserContactInformation } from '../../types/user';

export const getUsersAdmin = async (req: Request, res: Response) => {
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

export const getUsers = async (req: Request, res: Response) => {
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

export const getUsersByPermission = async (req: Request, res: Response) => {
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

export const syncNewstudent = async (req: Request<Record<string, never>, unknown, { date: string }>, res: Response) => {
    const { date } = req.body;

    type SiepStudent = {
        email: string;
        prenom: string;
        nom: string;
        Majeur: boolean;
        diplome: string;
        specialite: string;
    };

    try {
        const token = await SIEP_Utils.getTokenUTTAPI();
        const newStudents: SiepStudent[] = await SIEP_Utils.getNewStudentsFromUTTAPI_NOPAGE(token, date);
        const newStudentfiltered = newStudents.filter((student: SiepStudent) => !noSyncEmails.includes(student.email)); //Nouveau à ne pas sync (Démissionnaires, etc)

        for (const element of newStudentfiltered) {
            const userInDb = await user_service.getUserByEmail(element.email.toLowerCase());
            if (userInDb === undefined) {
                const tmpPassword = await bcrypt.hash(randomstring.generate(48), 10);
                const newUser = await user_service.createUser(
                    element.prenom,
                    element.nom,
                    element.email.toLowerCase(),
                    element.Majeur,
                    'Nouveau',
                    element.diplome === 'MA' ? 'Master' : element.specialite,
                    tmpPassword,
                );

                await auth_service.createRegistrationToken(newUser.id);
            }
        }
        Ok(res, { msg: 'All NewStudent created and synced' });
    } catch (error: unknown) {
        Error(res, { error });
    }
};

export const getCurrentUser = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    try {
        const user = await user_service.getUserById(userId);
        Ok(res, { data: user });
    } catch {
        Error(res, { msg: 'Erreur lors de la mise à jour du profil.' });
    }
};

export const getUserContactInformation = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const userContactInfo = await user_service.getUserContactInformation(parseInt(userId));
        Ok(res, { data: userContactInfo });
    } catch {
        Error(res, { msg: "Erreur lors de la récupération des informations de contact de l'utilisateur." });
    }
};

export const createUserContactInformation = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const contact: UserContactInformation = req.body;

    try {
        const result = await user_service.createUserContactInformation(parseInt(userId), contact);
        Ok(res, { msg: 'Informations de contact créées', data: result });
    } catch {
        Error(res, { msg: 'Erreur lors de la création des informations de contact.' });
    }
};

export const getCurrentUserOnboardingStatus = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    try {
        const status = await user_service.getCurrentUserOnboardingStatus(parseInt(userId));
        Ok(res, { data: status });
    } catch {
        Error(res, { msg: "Erreur lors de la récupération du statut d'onboarding." });
    }
};

export const getVssQuestionnaire = async (_req: Request, res: Response) => {
    try {
        const questionnaire = await user_service.getVssQuestionnaire();
        Ok(res, { data: questionnaire });
    } catch {
        Error(res, { msg: 'Erreur lors de la récupération du questionnaire VSS.' });
    }
};

export const submitVssQuestionnaire = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const payload = req.body;

    try {
        const result = await user_service.submitVssQuestionnaire(parseInt(userId), payload);
        Ok(res, { data: result });
    } catch {
        Error(res, { msg: 'Erreur lors de la soumission du questionnaire VSS.' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { branch, contact } = req.body;

    try {
        const result = await user_service.updateUserInfoByUserId(userId, branch, contact);
        Ok(res, { msg: 'Profil mis à jour', data: result });
    } catch {
        Error(res, { msg: 'Erreur lors de la mise à jour du profil.' });
    }
};

export const adminUpdateUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const updates = req.body;

    try {
        const result = await user_service.updateUserByAdmin(parseInt(userId), updates);
        Ok(res, { msg: 'Utilisateur mis à jour', data: result });
    } catch {
        Error(res, { msg: "Erreur lors de la mise à jour de l'utilisateur." });
    }
};

export const adminDeleteUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const result = await user_service.deleteUserById(parseInt(userId));
        Ok(res, { msg: 'Utilisateur supprimé', data: result });
    } catch {
        Error(res, { msg: "Erreur lors de la suppression de l'utilisateur." });
    }
};
