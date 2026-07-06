import fs from "fs";
import Papa from "papaparse";
import { db } from "../prisma/db";

type CsvPermanence = {
    name: string;
    description: string;
    location: string;
    start_at: string;
    end_at: string;
    capacity: string;
    is_open: string;
    difficulty: string;
};

// Classes d'erreurs personnalisées
class UnauthorizedError extends Error { }
class AlreadyRegisteredError extends Error { }
class PermanenceNotFoundError extends Error { }
class PermanenceClosedError extends Error { }
class PermanenceFullError extends Error { }
class UnregisterDeadlineError extends Error { }
class RegisterDeadlineError extends Error { }

export const getPermanenceById = async (permId: number) => {
    const permanence = await db.permanences.findUnique({ where: { id: permId } });
    if (!permanence) throw new PermanenceNotFoundError("Permanence introuvable");
    return permanence;
};

// S'inscrire à une permanence
export const registerUserToPermanence = async (userId: number, permId: number) => {
    try {
        const user = await db.users.findFirst({ where: { id: userId } });
        if (!user || (user.permission !== "Student" && user.permission !== "Admin")) {
            throw new UnauthorizedError("Unauthorized");
        }

        const permanence = await getPermanenceById(permId);

        if (!permanence.is_open)
            throw new PermanenceClosedError("Permanence not open");

        const limitDate = new Date(String(permanence.start_at).replace(/Z$/, ""));
        const now = new Date();

        if (now > limitDate) {
            throw new RegisterDeadlineError("Too late to register");
        }

        if (permanence.capacity == 0) {
            throw new PermanenceFullError("Permanence full");
        }

        // Transaction avec verrouillage complet pour gérer l'inscription et la mise à jour de la capacité
        await db.$transaction(async (tx) => {
            // 1. Verrouillage de la table
            await tx.$executeRaw`LOCK TABLE permanences IN EXCLUSIVE MODE`;

            // 2. Update de la capacité avec vérification
            const updateCount = await tx.$executeRaw`
                UPDATE permanences SET capacity = capacity - 1
                WHERE id = ${permId} AND capacity > 0
            `;

            // 3. Si aucune ligne modifiée = pas de place disponible
            if (updateCount === 0) {
                throw new PermanenceFullError("Permanence full");
            }

            // 4. Insérer l'utilisateur (seulement si l'UPDATE a réussi)
            await tx.user_permanences.create({
                data: { user_id: userId, permanence_id: permId }
            });
        });
    } catch (error: any) {
        // Gestion des erreurs de contraintes de base de données
        if (
            error.code === "23505" || // Contrainte unique PostgreSQL
            error.code === "23000" || // Contrainte d'intégrité générale
            error.message?.includes("UNIQUE constraint") ||
            error.message?.includes("duplicate key") ||
            error.message?.includes("PRIMARY KEY constraint")
        ) {
            throw new AlreadyRegisteredError("Already registered");
        }
        // Re-lancer les autres erreurs
        throw error;
    }
};

// Désinscrire un utilisateur d'une permanence
export const unregisterUserFromPermanence = async (userId: number, permId: number) => {
    const permanence = await getPermanenceById(permId);
    const now = new Date();
    const limitDate = new Date(permanence.start_at);
    limitDate.setDate(limitDate.getDate() - 1);

    if (now > limitDate)
        throw new UnregisterDeadlineError("Too late to unregister");

    await db.user_permanences.deleteMany({
        where: { user_id: userId, permanence_id: permId }
    });

    await modifyPermCap(permId, 1);
};

// Récupérer toutes les permanences ouvertes
export const listOpenPermanences = async () => {
    return await db.permanences.findMany({
        where: { is_open: true },
        orderBy: { start_at: 'asc' }
    });
};

// Créer une permanence
export const createPermanence = async (
    name: string,
    description: string,
    location: string,
    start_at: Date,
    end_at: Date,
    capacity: number,
    difficulty: number,
    respoId: number
) => {
    // 1. Créer la permanence
    const newPermanence = await db.permanences.create({
        data: {
            name,
            description,
            location,
            start_at,
            end_at,
            capacity,
            is_open: false,
            difficulty,
        },
        select: { id: true }
    });

    // 2. Associer le responsable à la permanence
    if (newPermanence?.id && respoId) {
        await db.respo_permanences.create({
            data: { user_id: respoId, permanence_id: newPermanence.id }
        });
    }
};

// Supprimer une permanence
export const deletePermanence = async (permId: number) => {
    // Supprimer les inscriptions des utilisateurs
    await db.user_permanences.deleteMany({ where: { permanence_id: permId } });
    // Supprimer le responsable de la permanence
    await db.respo_permanences.deleteMany({ where: { permanence_id: permId } });
    // Supprimer la permanence elle-même
    await db.permanences.delete({ where: { id: permId } });
};

// Mettre à jour les détails d'une permanence
export const updatePermanence = async (
    permId: number,
    name: string,
    description: string,
    location: string,
    start_at: Date,
    end_at: Date,
    capacity: number,
    difficulty: number,
    respoId: number
) => {
    // Mettre à jour les détails de la permanence
    await db.permanences.update({
        where: { id: permId },
        data: { name, description, location, start_at, end_at, capacity, is_open: false, difficulty }
    });

    // Supprimer l'ancien responsable et ajouter le nouveau si nécessaire
    await db.respo_permanences.deleteMany({ where: { permanence_id: permId } });

    if (respoId) {
        await db.respo_permanences.create({ data: { user_id: respoId, permanence_id: permId } });
    }
};

// Ouvrir une permanence (Admin action)
export const openPermanence = async (permId: number) => {
    await db.permanences.update({ where: { id: permId }, data: { is_open: true } });
};

// Fermer une permanence (Admin action)
export const closePermanence = async (permId: number) => {
    await db.permanences.update({ where: { id: permId }, data: { is_open: false } });
};

// Modifier la capacité de la permanence
export const modifyPermCap = async (permId: number, factor: number) => {
    const perm = await getPermanenceById(permId);
    const newPermCap = Number(perm.capacity) + factor;
    if (newPermCap < 0) throw new Error("Invalid capacity");
    await db.permanences.update({ where: { id: permId }, data: { capacity: newPermCap } });
};

// Voir ses permanences
export const getMyPermanences = async (userId: number) => {
    const userPerms = await db.user_permanences.findMany({
        where: { user_id: userId },
        include: {
            permanences: {
                select: { id: true, name: true, start_at: true, end_at: true, location: true }
            }
        }
    });

    const results = await Promise.all(
        userPerms.map(async (up) => {
            const respo = await db.respo_permanences.findFirst({
                where: { permanence_id: up.permanence_id },
                include: {
                    users: { select: { id: true, first_name: true, last_name: true, email: true } }
                }
            });
            return {
                ...up.permanences,
                respo: respo ? {
                    id: respo.users.id,
                    firstName: respo.users.first_name,
                    lastName: respo.users.last_name,
                    email: respo.users.email,
                } : null
            };
        })
    );

    return results;
};

// Récupérer toutes les permanences avec leurs responsables et membres
export const getAllPermanences = async () => {
    const perms = await db.permanences.findMany();

    const results = await Promise.all(
        perms.map(async (perm) => {
            const respo = await db.respo_permanences.findFirst({
                where: { permanence_id: perm.id },
                include: {
                    users: { select: { id: true, first_name: true, last_name: true, email: true } }
                }
            });
            return {
                ...perm,
                respo: respo ? {
                    userId: respo.users.id,
                    firstName: respo.users.first_name,
                    lastName: respo.users.last_name,
                    email: respo.users.email,
                } : null
            };
        })
    );

    return results;
};

// Récupérer les utilisateurs inscrits à une permanence
export const getUsersInPermanence = async (permId: number) => {
    const rows = await db.user_permanences.findMany({
        where: { permanence_id: permId },
        include: {
            users: { select: { id: true, first_name: true, last_name: true } }
        }
    });
    return rows.map(r => ({
        userId: r.users.id,
        firstName: r.users.first_name,
        lastName: r.users.last_name,
        claimed: r.claimed,
    }));
};

// Ajouter un utilisateur à une permanence (Admin action)
export const addUserToPermanence = async (userId: number, permId: number) => {
    await db.user_permanences.create({ data: { user_id: userId, permanence_id: permId } });
    await modifyPermCap(permId, -1);
};

// Supprimer un utilisateur d'une permanence (Admin action)
export const removeUserToPermanence = async (userId: number, permId: number) => {
    await db.user_permanences.deleteMany({ where: { user_id: userId, permanence_id: permId } });
    await modifyPermCap(permId, 1);
};

// Récupérer toutes les permanences avec leurs utilisateurs
export const getAllPermanencesWithUsers = async () => {
    // Récupère toutes les permanences
    const permanences = await getAllPermanences();

    // Pour chaque permanence, on récupère les users associés avec leur statut claimed
    const results = await Promise.all(
        permanences.map(async (permanence) => {
            const userRelations = await db.user_permanences.findMany({
                where: { permanence_id: permanence.id },
                include: {
                    users: { select: { id: true, first_name: true, last_name: true, email: true } }
                }
            });
            return {
                ...permanence,
                users: userRelations.map(r => ({
                    id: r.users.id,
                    first_name: r.users.first_name,
                    last_name: r.users.last_name,
                    email: r.users.email,
                    claimed: r.claimed,
                }))
            };
        })
    );

    return results;
};

// Permet l'importation de permanences depuis un fichier CSV
export const importPermanencesFromCSV = async (filePath: string): Promise<void> => {
    const fileContent = fs.readFileSync(filePath, "utf8");

    const { data, errors } = Papa.parse<CsvPermanence>(fileContent, {
        header: true,
        skipEmptyLines: true,
    });

    if (errors.length > 0) {
        console.error("CSV parsing errors:", errors);
        throw new Error("Erreur lors du parsing du CSV.");
    }

    const parsedData = data.map((r) => ({
        name: r.name,
        description: r.description,
        location: r.location,
        start_at: new Date(r.start_at),
        end_at: new Date(r.end_at),
        capacity: parseInt(r.capacity, 10),
        difficulty: parseInt(r.difficulty, 10),
        is_open: false,
    }));

    await db.permanences.createMany({ data: parsedData });
};

// Vérifie si un utilisateur est responsable d'une permanence
export const isUserRespoOfPermanence = async (userId: number): Promise<boolean> => {
    const respo = await db.respo_permanences.findFirst({ where: { user_id: userId } });
    return respo !== null;
};

// Récupère les détails des permanences pour un responsable spécifique
export const getPermanenceDetailsForRespo = async (respoId: number) => {
    // Récupérer toutes les permanences pour lesquelles l'utilisateur est responsable
    const respos = await db.respo_permanences.findMany({ where: { user_id: respoId } });
    const permanenceIds = respos.map(r => r.permanence_id);
    if (permanenceIds.length === 0) throw new Error("Pas de permanences");

    // Récupérer les permanences et leurs membres
    const permanences = await db.permanences.findMany({ where: { id: { in: permanenceIds } } });

    const results = await Promise.all(
        permanences.map(async (perm) => {
            const members = await db.user_permanences.findMany({
                where: { permanence_id: perm.id },
                include: {
                    users: { select: { id: true, first_name: true, last_name: true, email: true } }
                }
            });
            return {
                permanence: perm,
                members: members.map(m => ({
                    id: m.users.id,
                    first_name: m.users.first_name,
                    last_name: m.users.last_name,
                    email: m.users.email,
                    claimed: m.claimed,
                }))
            };
        })
    );

    return results;
};

// Permet à un utilisateur de "claim" sa présence à une permanence
export const claimMember = async (userId: number, permId: number, claimed: boolean) => {
    await db.user_permanences.updateMany({
        where: { user_id: userId, permanence_id: permId },
        data: { claimed }
    });
};
