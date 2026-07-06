import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import * as randomstring from 'randomstring';
import { db } from '../database/db'; // Import de la connexion PostgreSQL
import type { AdminCreateUserDto } from '../dto/user.dto';
import { type User, userSchema } from '../schemas/Basic/user.schema';
import { registrationSchema } from '../schemas/Relational/registration.schema';
import * as auth_service from '../services/auth.service';
import * as SIEP_Utils from '../utils/siep';
import * as Banned_Service from './banned.service';
import { createRegistrationToken } from './auth.service';
import { getFaction } from './faction.service';
import { getUserRoles } from './role.service';
import { getTeam, getTeamFaction, getUserTeam } from './team.service';

// Fonction pour récupérer un utilisateur par email
export const getUserByEmail = async (email: string) => {
    try {
        const users = await db.select().from(userSchema).where(eq(userSchema.email, email));
        return users[0];
    } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur par email:", err);
        throw new Error('Erreur de base de données');
    }
};

export const getUserById = async (userId: number) => {
    try {
        const user = await db
            .select({
                userId: userSchema.id,
                firstName: userSchema.first_name,
                lastName: userSchema.last_name,
                email: userSchema.email,
                majeur: userSchema.majeur,
                branch: userSchema.branch,
                contact: userSchema.contact,
                permission: userSchema.permission,
                discord_id: userSchema.discord_id,
            })
            .from(userSchema)
            .where(eq(userSchema.id, userId));
        return user[0];
    } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur par email:", err);
        throw new Error('Erreur de base de données');
    }
};

export const syncNewStudents = async (data: string) => {
    const token = await SIEP_Utils.getTokenUTTAPI();

    const newStudents = await SIEP_Utils.getNewStudentsFromUTTAPI_NOPAGE(token, data);

    const noSyncEmails = await Banned_Service.getAllBanned().then((bannedList) =>
        bannedList.map((banned) => banned.email),
    );

    const filteredStudents = newStudents.filter((student: any) => !noSyncEmails.includes(student.email));

    for (const student of filteredStudents) {
        const userInDb = await getUserByEmail(student.email.toLowerCase());

        if (!userInDb) {
            const tmpPassword = randomstring.generate(48);

            const newUser = await createUser(
                student.prenom,
                student.nom,
                student.email.toLowerCase(),
                student.Majeur,
                'Nouveau',
                student.diplome === 'MA' ? 'Master' : student.specialite,
                tmpPassword,
            );

            await auth_service.createRegistrationToken(newUser.id);
        }
    }

    return filteredStudents.length;
};

// Fonction pour enregistrer un nouvel utilisateur
export const createUser = async (
    firstName: string,
    lastName: string,
    email: string,
    majeur: boolean,
    permission: string,
    branch: string,
    password: string,
) => {
    try {
        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: Partial<User> = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            branch: branch === 'CV_ING' ? 'RI' : branch,
            majeur: majeur,
            password: hashedPassword,
            permission: permission,
        };
        // Insérer un nouvel utilisateur dans la base de données
        const result = await db.insert(userSchema).values(newUser).returning();

        return result[0];
    } catch (err) {
        console.error("Erreur lors de la création de l'utilisateur:", err);
        throw new Error('Erreur de base de données');
    }
};

// Fonction pour comparer les mots de passe (utilisée lors de la connexion)
export const comparePassword = async (enteredPassword: string, storedPassword: string) => {
    return await bcrypt.compare(enteredPassword, storedPassword);
};

export const updateUserStudent = async (firstName: string, lastName: string, email: string) => {
    try {
        const result = await db
            .update(userSchema)
            .set({
                first_name: firstName,
                last_name: lastName,
            })
            .where(eq(userSchema.email, email));

        return result.rows[0];
    } catch (err) {
        console.error("Erreur lors de la récupération et de l'update de l'utilisateur par email:", err);
        throw new Error('Erreur de base de données');
    }
};

export const adminCreateUser = async (data: AdminCreateUserDto) => {
    const userInDb = await getUserByEmail(data.email.toLowerCase());

    if (userInDb) {
        throw new Error('Utilisateur déjà existant');
    }

    const tmpPassword = randomstring.generate(48);

    const newUser = await createUser(
        data.firstName,
        data.lastName,
        data.email.toLowerCase(),
        data.major,
        'Nouveau',
        data.branch === 'MA' ? 'Master' : data.branch,
        tmpPassword,
    );

    await createRegistrationToken(newUser.id);

    // TODO: envoi de mail Welcome si la notification est demandée.
    // J'attend de pouvoir me rebase sur la dev avec les modifications de mails fonctionnelles.
    // if (data.withNotification) {}

    return newUser;
};

export const getUsersAdmin = async () => {
    try {
        const users = await db
            .select({
                userId: userSchema.id,
                firstName: userSchema.first_name,
                lastName: userSchema.last_name,
                email: userSchema.email,
                majeur: userSchema.majeur,
                branch: userSchema.branch,
                contact: userSchema.contact,
                permission: userSchema.permission,
                discord_id: userSchema.discord_id,
            })
            .from(userSchema);
        return users;
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs ', err);
        throw new Error('Erreur de base de données');
    }
};

export const getUsers = async () => {
    try {
        const users = await db
            .select({
                userId: userSchema.id,
                firstName: userSchema.first_name,
                lastName: userSchema.last_name,
                permission: userSchema.permission,
                email: userSchema.email,
            })
            .from(userSchema);
        return users;
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs ', err);
        throw new Error('Erreur de base de données');
    }
};

export const getUsersAll = async () => {
    try {
        const users = await db.select().from(userSchema);

        const userWithTeam = await Promise.all(
            users.map(async (user) => {
                const roles = await getUserRoles(user.id);
                let teamId = await getUserTeam(user.id);
                teamId = teamId ?? null;

                let teamName: string | null = null;
                let factionId: number | null = null;
                let factionName: string | null = null;

                if (teamId) {
                    const team = await getTeam(teamId);
                    teamName = team?.teamName ?? null;

                    factionId = await getTeamFaction(teamId);
                    const faction = await getFaction(factionId);
                    factionName = faction?.name ?? null;
                }

                return {
                    ...user,
                    teamId,
                    teamName,
                    factionId,
                    factionName,
                    roles,
                };
            }),
        );

        return userWithTeam;
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs ', err);
        throw new Error('Erreur de base de données');
    }
};

export const getUsersbyPermission = async (permission: string) => {
    try {
        const users = await db
            .select({
                userId: userSchema.id,
                firstName: userSchema.first_name,
                lastName: userSchema.last_name,
                email: userSchema.email,
                branch: userSchema.branch,
            })
            .from(userSchema)
            .where(eq(userSchema.permission, permission));
        return users;
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs ', err);
        throw new Error('Erreur de base de données');
    }
};

export const updateUserPassword = async (userId: number, password: string) => {
    try {
        const result = await db
            .update(userSchema)
            .set({
                password: password,
            })
            .where(eq(userSchema.id, userId));

        return result.rows[0];
    } catch (err) {
        console.error("Erreur lors de la récupération et de l'update de l'utilisateur par email:", err);
        throw new Error('Erreur de base de données');
    }
};

export const updateUserInfoByUserId = async (userId: number, branch?: string, contact?: string) => {
    try {
        const result = await db
            .update(userSchema)
            .set({
                branch: branch,
                contact: contact,
            })
            .where(eq(userSchema.id, userId));

        return result;
    } catch (err) {
        console.error('Erreur lors de la mise à jour des infos utilisateur:', err);
        throw new Error('Erreur de base de données');
    }
};

export const updateUserByAdmin = async (userId: number, updates: Partial<User>) => {
    try {
        if (Object.keys(updates).length === 0) {
            throw new Error('Aucune donnée à mettre à jour');
        }

        const result = await db.update(userSchema).set(updates).where(eq(userSchema.id, userId));

        return result;
    } catch (err) {
        console.error("Erreur lors de la mise à jour par l'admin:", err);
        throw new Error('Erreur de base de données');
    }
};

export const deleteUserById = async (userId: number) => {
    try {
        const user_registration_token = await db
            .select({ user_id: registrationSchema.user_id })
            .from(registrationSchema)
            .where(eq(registrationSchema.user_id, userId));

        if (user_registration_token.length > 0) {
            await db.delete(registrationSchema).where(eq(registrationSchema.user_id, userId));
        }

        const result = await db.delete(userSchema).where(eq(userSchema.id, userId));
        return result;
    } catch (err) {
        console.error("Erreur lors de la suppression de l'utilisateur:", err);
        throw new Error('Erreur de base de données');
    }
};
