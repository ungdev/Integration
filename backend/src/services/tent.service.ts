import { db } from "../prisma/db";

/**
 * Créer une réservation de tente entre 2 utilisateurs.
 */
export const createTent = async (userId1: number, userId2: number) => {
    if (userId1 === userId2) {
        throw new Error("Impossible de réserver une tente avec soi-même.");
    }

    // Vérifier si l'un des deux a déjà une tente
    const existing = await db.user_tent.findMany({
        where: {
            OR: [
                { user_id_1: userId1 },
                { user_id_2: userId1 },
                { user_id_1: userId2 },
                { user_id_2: userId2 },
            ]
        }
    });

    if (existing.length > 0) {
        throw new Error("Un des utilisateurs a déjà une tente.");
    }

    return await db.user_tent.create({ data: { user_id_1: userId1, user_id_2: userId2 } });
};

/**
 * Annuler une tente (par l'un ou l'autre des utilisateurs).
 */
export const cancelTent = async (userId1: number) => {
    return await db.user_tent.deleteMany({
        where: {
            OR: [
                { user_id_1: userId1 },
                { user_id_2: userId1 }
            ]
        }
    });
};

/**
 * Récupérer la tente d'un utilisateur.
 */
export const getTentByUser = async (userId: number) => {
    return await db.user_tent.findMany({
        where: {
            OR: [
                { user_id_1: userId },
                { user_id_2: userId }
            ]
        }
    });
};

/**
 * Récupérer toutes les tentes (avec infos des 2 utilisateurs).
 */
export const getAllTents = async () => {
    const tents = await db.user_tent.findMany({
        include: {
            users_user_tent_user_id_1Tousers: {
                select: { first_name: true, last_name: true, email: true, majeur: true }
            },
            users_user_tent_user_id_2Tousers: {
                select: { first_name: true, last_name: true, email: true, majeur: true }
            },
        }
    });
    return tents.map(t => ({
        user1_id: t.user_id_1,
        user2_id: t.user_id_2,
        user1_first_name: t.users_user_tent_user_id_1Tousers.first_name,
        user1_last_name: t.users_user_tent_user_id_1Tousers.last_name,
        user1_email: t.users_user_tent_user_id_1Tousers.email,
        user1_majeur: t.users_user_tent_user_id_1Tousers.majeur,
        user2_first_name: t.users_user_tent_user_id_2Tousers.first_name,
        user2_last_name: t.users_user_tent_user_id_2Tousers.last_name,
        user2_email: t.users_user_tent_user_id_2Tousers.email,
        user2_majeur: t.users_user_tent_user_id_2Tousers.majeur,
        confirmed: t.confirmed,
    }));
};

/**
 * Met à jour la confirmation(avec infos des 2 utilisateurs).
 */
export const toggleTentConfirmation = async (
    userId1: number,
    userId2: number,
    confirmed: boolean
) => {
    if (userId1 === userId2) {
        throw new Error("Les deux utilisateurs doivent être différents.");
    }

    // Vérifier si la tente existe
    const existingTent = await db.user_tent.findFirst({
        where: {
            OR: [
                { user_id_1: userId1, user_id_2: userId2 },
                { user_id_1: userId2, user_id_2: userId1 },
            ]
        }
    });

    if (!existingTent) {
        throw new Error("La tente entre ces deux utilisateurs n'existe pas.");
    }

    await db.user_tent.updateMany({
        where: {
            OR: [
                { user_id_1: userId1, user_id_2: userId2 },
                { user_id_1: userId2, user_id_2: userId1 },
            ]
        },
        data: { confirmed }
    });

    return { success: true, message: confirmed ? "Tente validée." : "Tente dévalidée." };
};
