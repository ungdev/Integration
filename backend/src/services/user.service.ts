import bcrypt from 'bcryptjs';
import { db } from '../prisma/db';
import { getFaction } from './faction.service';
import { getUserRoles } from './role.service';
import { getTeam, getTeamFaction, getUserTeam } from './team.service';

// Fonction pour récupérer un utilisateur par email
export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.users.findFirst({ where: { email } });
        return user ?? undefined;
    } catch (err) {
        console.error('Erreur lors de la récupération de l\'utilisateur par email:', err);
        throw new Error('Erreur de base de données');
    }
};

// Fonction pour récupérer un utilisateur par ID
export const getUserById = async (userId: number) => {
    try {
        const user = await db.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                majeur: true,
                branch: true,
                contact: true,
                permission: true,
                discord_id: true,
            }
        });
        if (!user) return undefined;
        return {
            userId: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            majeur: user.majeur,
            branch: user.branch,
            contact: user.contact,
            permission: user.permission,
            discord_id: user.discord_id,
        };
    } catch (err) {
        console.error('Erreur lors de la récupération de l\'utilisateur par id:', err);
        throw new Error('Erreur de base de données');
    }
};

// Fonction pour enregistrer un nouvel utilisateur
export const createUser = async (
    firstName: string,
    lastName: string,
    email: string,
    majeur: boolean,
    permission: string,
    branch: string,
    password: string
) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.users.create({
            data: {
                first_name: firstName,
                last_name: lastName,
                email: email,
                branch: branch === "CV_ING" ? "RI" : branch,
                majeur: majeur,
                password: hashedPassword,
                permission: permission,
            }
        });
        return newUser;
    } catch (err) {
        console.error('Erreur lors de la création de l\'utilisateur:', err);
        throw new Error('Erreur de base de données');
    }
};

// Fonction pour comparer les mots de passe (utilisée lors de la connexion)
export const comparePassword = async (enteredPassword: string, storedPassword: string) => {
    return await bcrypt.compare(enteredPassword, storedPassword);
};

export const updateUserStudent = async (firstName: string, lastName: string, email: string) => {
    try {
        await db.users.updateMany({
            where: { email },
            data: { first_name: firstName, last_name: lastName }
        });
    } catch (err) {
        console.error('Erreur lors de l\'update de l\'utilisateur par email:', err);
        throw new Error('Erreur de base de données');
    }
};

export const getUsersAdmin = async () => {
    try {
        const users = await db.users.findMany({
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                majeur: true,
                branch: true,
                contact: true,
                permission: true,
                discord_id: true,
            }
        });
        return users.map(u => ({
            userId: u.id,
            firstName: u.first_name,
            lastName: u.last_name,
            email: u.email,
            majeur: u.majeur,
            branch: u.branch,
            contact: u.contact,
            permission: u.permission,
            discord_id: u.discord_id,
        }));
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
        throw new Error('Erreur de base de données');
    }
};

export const getUsers = async () => {
    try {
        const users = await db.users.findMany({
            select: {
                id: true,
                first_name: true,
                last_name: true,
                permission: true,
                email: true,
            }
        });
        return users.map(u => ({
            userId: u.id,
            firstName: u.first_name,
            lastName: u.last_name,
            permission: u.permission,
            email: u.email,
        }));
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
        throw new Error('Erreur de base de données');
    }
};

export const getUsersAll = async () => {
    try {
        const users = await db.users.findMany();

        const userWithTeam = await Promise.all(
            users.map(async (user) => {
                const roles = await getUserRoles(user.id);
                let teamId = await getUserTeam(user.id);
                const resolvedTeamId = teamId ?? null;

                let teamName: string | null = null;
                let factionId: number | null = null;
                let factionName: string | null = null;

                if (resolvedTeamId) {
                    const team = await getTeam(resolvedTeamId);
                    teamName = team?.teamName ?? null;

                    factionId = await getTeamFaction(resolvedTeamId);
                    const faction = await getFaction(factionId);
                    factionName = faction?.name ?? null;
                }

                return {
                    ...user,
                    teamId: resolvedTeamId,
                    teamName,
                    factionId,
                    factionName,
                    roles,
                };
            })
        );

        return userWithTeam;
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
        throw new Error('Erreur de base de données');
    }
};

export const getUsersbyPermission = async (permission: string) => {
    try {
        const users = await db.users.findMany({
            where: { permission },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                branch: true,
            }
        });
        return users.map(u => ({
            userId: u.id,
            firstName: u.first_name,
            lastName: u.last_name,
            email: u.email,
            branch: u.branch,
        }));
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
        throw new Error('Erreur de base de données');
    }
};

export const updateUserPassword = async (userId: number, password: string) => {
    try {
        await db.users.update({ where: { id: userId }, data: { password } });
    } catch (err) {
        console.error('Erreur lors de l\'update du mot de passe:', err);
        throw new Error('Erreur de base de données');
    }
};

export const updateUserInfoByUserId = async (
    userId: number,
    branch?: string,
    contact?: string
) => {
    try {
        await db.users.update({ where: { id: userId }, data: { branch, contact } });
    } catch (err) {
        console.error('Erreur lors de la mise à jour des infos utilisateur:', err);
        throw new Error('Erreur de base de données');
    }
};

export const updateUserByAdmin = async (
    userId: number,
    updates: Record<string, any>
) => {
    try {
        if (Object.keys(updates).length === 0) {
            throw new Error('Aucune donnée à mettre à jour');
        }
        await db.users.update({ where: { id: userId }, data: updates });
    } catch (err) {
        console.error('Erreur lors de la mise à jour par l\'admin:', err);
        throw new Error('Erreur de base de données');
    }
};

export const deleteUserById = async (userId: number) => {
    try {
        await db.registration_tokens.deleteMany({ where: { user_id: userId } });
        await db.users.delete({ where: { id: userId } });
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', err);
        throw new Error('Erreur de base de données');
    }
};
