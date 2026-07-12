import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../database/db'; // Import de la connexion PostgreSQL
import { type User, userSchema } from '../schemas/Basic/user.schema';
import { registrationSchema } from '../schemas/Relational/registration.schema';
import { getFaction } from './faction.service';
import { getUserRoles } from './role.service';
import { getTeam, getTeamFaction, getUserTeam } from './team.service';
import { userInformationSchema } from '../schemas/Relational/userinformation.schema';
import { type UserContactInformation } from '../../types/user';

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

export const getUserContactInformation = async (userId: number) => {
    try {
        const user = await db
            .select({
                userId: userInformationSchema.user_id,
                urgency_contact_name: userInformationSchema.urgency_contact_name,
                urgency_contact_phone: userInformationSchema.urgency_contact_phone,
                contact_CE: userInformationSchema.contact_CE,
            })
            .from(userInformationSchema)
            .where(eq(userInformationSchema.user_id, userId));
        return user[0];
    } catch (err) {
        console.error("Erreur lors de la récupération des informations de contact de l'utilisateur ", err);
        throw new Error('Erreur de base de données');
    }
};

export const createUserContactInformation = async (userId: number, contact: UserContactInformation) => {
    try {
        const newContactInfo = {
            user_id: userId,
            urgency_contact_name: contact.UrgencyContactName,
            urgency_contact_phone: contact.UrgencyContactPhone,
            contact_CE: contact.ContactCE,
        };

        const result = await db.insert(userInformationSchema).values(newContactInfo).returning();
        return result[0];
    } catch (err) {
        console.error("Erreur lors de la création des informations de contact de l'utilisateur:", err);
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
