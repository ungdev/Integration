import bcrypt from 'bcryptjs';
import { randomBytes } from "crypto";
import { JSDOM } from 'jsdom';
import jwt from 'jsonwebtoken';
import { db } from '../prisma/db';
import { cas_validate_url, jwtSecret } from '../utils/secret';
import * as role_service from './role.service';
import * as user_service from './user.service';

// Fonction pour hacher le mot de passe
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Fonction pour vérifier le mot de passe
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};

// Fonction pour générer un token JWT
export const generateToken = (user: { id: number; email: string | null; permission: string | null; roles: { roleId: number; roleName: string }[] }) => {
    return jwt.sign(
        {
            userId: user.id,
            userEmail: user.email,
            userPermission: user.permission,
            userRoles: user.roles,
        },
        jwtSecret,
        { expiresIn: "1h" }
    );
};

// Fonction de connexion
export const loginUser = async (email: string, password: string) => {
    // Chercher l'utilisateur par email
    const user = await user_service.getUserByEmail(email);
    if (!user) {
        throw new Error("Utilisateur non trouvé");
    }

    // Vérifier le mot de passe
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error("Mot de passe incorrect");
    }

    const userRoles = await role_service.getUserRoles(user.id);

    const enrichedUser = { ...user, roles: userRoles };

    // Générer un token JWT avec les rôles inclus
    const token = generateToken(enrichedUser);
    return token;
};

// Fonction d'inscription
export const registerUser = async (firstName: string, lastName: string, email: string, password: string) => {
    // Vérifier si l'email est déjà pris
    const existingUser = await user_service.getUserByEmail(email);
    if (existingUser) {
        throw new Error('L\'email est déjà pris');
    }

    // Hacher le mot de passe avant de l'enregistrer
    const hashedPassword = await hashPassword(password);

    // Créer l'utilisateur dans la base de données
    const newUser = await db.users.create({
        data: {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: hashedPassword,
            permission: 'Nouveau',
        }
    });

    return newUser;
};

export const validateCASTicket = async (ticket: string) => {
    try {
        const validateUrl = `${cas_validate_url}?service=${encodeURIComponent('https://integration.utt.fr/')}&ticket=${ticket}`;
        const response = await fetch(validateUrl);
        if (response.ok) {
            const text = await response.text();
            /*console.log("====================validateCASTicket")
            console.log(text)
            console.log("validateCASTicket====================")*/
            const isValid = text.includes("authenticationSuccess");
            if (isValid) {
                // User is authenticated
                return await parseUsernameFromCASResponse(text);
            } else {
                console.error("CAS ticket validation failed");
            }
        } else {
            console.error("Failed to validate CAS ticket");
        }
    } catch {
        throw new Error("Failed to fetch CAS. Please try again later.");
    }
};

export const parseUsernameFromCASResponse = async (response: string) => {
    const dom = new JSDOM(response, { contentType: "application/xml" });
    const document = dom.window.document;
    const authSuccessNode = document.getElementsByTagName("cas:authenticationSuccess")[0];
    if (authSuccessNode) {
        const attributesNode = authSuccessNode.getElementsByTagName("cas:attributes")[0];
        if (attributesNode) {
            return {
                uid: attributesNode.getElementsByTagName("cas:uid")[0]?.textContent,
                email: attributesNode.getElementsByTagName("cas:mail")[0]?.textContent,
                sn: attributesNode.getElementsByTagName("cas:sn")[0]?.textContent,
                givenName: attributesNode.getElementsByTagName("cas:givenName")[0]?.textContent,
            };
        }
    }
};

export const completeRegistration = async (token: string, password: string) => {
    const tokenRow = await db.registration_tokens.findFirst({ where: { token } });

    if (!tokenRow || new Date(tokenRow.expires_at) < new Date()) {
        throw new Error("Token invalide ou expiré.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.users.update({
        where: { id: tokenRow.user_id },
        data: { password: hashedPassword, permission: "Nouveau" }
    });

    await db.registration_tokens.delete({ where: { id: tokenRow.id } });
};

export const createRegistrationToken = async (userId: number) => {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90); // 90 jours

    await db.registration_tokens.create({
        data: { user_id: userId, token, expires_at: expiresAt }
    });

    return token;
};

export const deleteUserRegistrationToken = async (userId: number) => {
    try {
        await db.registration_tokens.deleteMany({ where: { user_id: userId } });
    } catch (error) {
        throw new Error(error);
    }
};
