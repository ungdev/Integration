import { db } from "../prisma/db";
import * as team_service from "./team.service";

// 1. Créer un challenge
export const createChallenge = async (
    title: string,
    description: string,
    category: string,
    points: number,
    created_by: number
) => {
    return await db.challenges.create({
        data: { title, description, category, points, created_by }
    });
};

// 2. Supprimer un challenge
export const deleteChallenge = async (challengeId: number) => {
    // Vérifier si le challenge existe
    const challenge = await db.challenges.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new Error("Challenge introuvable");

    // Supprimer les validations associées avant de supprimer le challenge
    await db.challenge_validation.deleteMany({ where: { challenge_id: challengeId } });
    // Supprimer le challenge
    await db.challenges.delete({ where: { id: challengeId } });

    return { message: `Challenge avec ID ${challengeId} supprimé` };
};

// 3. Récupérer tous les challenges sauf le free
export const getAllChallenges = async () => {
    return await db.challenges.findMany({ where: { id: { not: 1 } } });
};

// 4. Valider un challenge et attribuer des points
export const validateChallenge = async ({
    challengeId,
    type,
    targetId,
    validatedBy
}: {
    challengeId: number;
    type: "user" | "team" | "faction";
    targetId: number;
    validatedBy: number;
}) => {
    // 1. Vérifier si le challenge existe
    const challenge = await db.challenges.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new Error("Challenge introuvable");

    // 2. Déterminer les IDs de l'équipe et de la faction en fonction du type
    let target_team_id: number | null = null;
    let target_faction_id: number | null = null;

    switch (type) {
        case "user":
            target_team_id = await team_service.getUserTeam(targetId) ?? null;
            target_faction_id = target_team_id ? await team_service.getTeamFaction(target_team_id) : null;
            break;
        case "team":
            target_faction_id = await team_service.getTeamFaction(targetId);
            if (target_faction_id === 0) throw new Error("Il n'y a pas de faction associée");
            break;
        case "faction":
            target_faction_id = targetId;
            break;
        default:
            throw new Error("Type de challenge non valide");
    }

    // 3. Créer l'entrée dans challenge_validation
    const inserted = await db.challenge_validation.create({
        data: {
            challenge_id: challengeId,
            validated_by_admin_id: validatedBy,
            validated_at: new Date(),
            points: challenge.points,
            added_by_admin_id: validatedBy,
            target_user_id: type === "user" ? targetId : null,
            target_team_id: target_team_id ? target_team_id : (type === "team" ? targetId : null),
            target_faction_id: target_faction_id ?? null,
        }
    });

    return inserted;
};

// 5. Ajouter ou retirer des points manuellement
export const modifyFactionPoints = async ({
    title,
    factionId,
    points,
    reason,
    adminId
}: {
    title: string;
    factionId: number;
    points: number;
    reason: string;
    adminId: number;
}) => {
    const newchall = await createChallenge(title, reason, "Free", points, adminId);
    const insert = await db.challenge_validation.create({
        data: {
            challenge_id: newchall.id,
            validated_by_admin_id: adminId,
            validated_at: new Date(),
            points: points,
            added_by_admin_id: adminId,
            target_faction_id: factionId,
        }
    });
    return insert;
};

export const modifyChallenge = async ({
    challengeId,
    title,
    description,
    category,
    points
}: {
    challengeId: number;
    title?: string;
    description?: string;
    category?: string;
    points?: number;
}) => {
    // 1. Vérifier si le challenge existe
    const challenge = await db.challenges.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new Error("Challenge introuvable");

    // 2. Construire l'objet de mise à jour
    const updateValues: any = {};
    if (title) updateValues.title = title;
    if (description) updateValues.description = description;
    if (category) updateValues.category = category;
    if (points !== undefined) updateValues.points = points;

    // 3. Mettre à jour le challenge
    return await db.challenges.update({ where: { id: challengeId }, data: updateValues });
};

export const unvalidateChallenge = async ({
    challengeId,
    factionId,
    teamId,
    userId
}: {
    challengeId: number;
    factionId: number;
    teamId: number;
    userId: number;
}) => {
    const rowToDelete = await db.challenge_validation.findFirst({
        where: {
            AND: [
                { challenge_id: challengeId },
                { target_faction_id: factionId },
                ...(teamId ? [{ target_team_id: teamId }] : []),
                ...(userId ? [{ target_user_id: userId }] : []),
            ]
        }
    });
    if (rowToDelete) {
        await db.challenge_validation.delete({ where: { id: rowToDelete.id } });
    }
};

export const getValidatedChallenges = async () => {
    try {
        const rows = await db.challenge_validation.findMany({
            orderBy: { validated_at: 'desc' },
            include: {
                challenges: { select: { title: true, category: true, description: true } },
                users_challenge_validation_target_user_idTousers: {
                    select: { first_name: true, last_name: true }
                },
                teams: { select: { name: true } },
                factions: { select: { name: true } },
            }
        });
        return rows.map(vc => ({
            challenge_id: vc.challenge_id,
            challenge_name: vc.challenges?.title ?? null,
            challenge_categorie: vc.challenges?.category ?? null,
            challenge_description: vc.challenges?.description ?? null,
            points: vc.points,
            validated_at: vc.validated_at,
            target_user_id: vc.target_user_id,
            target_team_id: vc.target_team_id,
            target_faction_id: vc.target_faction_id,
            target_user_firstname: vc.users_challenge_validation_target_user_idTousers?.first_name ?? null,
            target_user_lastname: vc.users_challenge_validation_target_user_idTousers?.last_name ?? null,
            target_team_name: vc.teams?.name ?? null,
            target_faction_name: vc.factions?.name ?? null,
        }));
    } catch (error) {
        console.error("Error retrieving validated challenges:", error);
        throw new Error("Error retrieving validated challenges");
    }
};

export const getTotalFactionPoints = async (factionId: number): Promise<number> => {
    try {
        const result = await db.challenge_validation.aggregate({
            where: { target_faction_id: factionId },
            _sum: { points: true }
        });
        return Number(result._sum.points) || 0;
    } catch (error) {
        console.error("Erreur lors de la récupération des points de la faction:", error);
        throw new Error("Impossible de récupérer les points de la faction");
    }
};
