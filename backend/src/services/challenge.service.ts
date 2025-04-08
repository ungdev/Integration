import { db } from "../database/db";
import { challengeSchema } from "../schemas/Basic/challenge.schema";
import { challengeValidationSchema } from "../schemas/Relational/challengevalidation.schema"; // Schéma combiné
import { and, desc, eq, isNotNull, isNull, sum } from "drizzle-orm";
import * as team_service from "./team.service";
import * as faction_service from "./faction.service";
import { userSchema } from "../schemas/Basic/user.schema";
import { teamSchema } from "../schemas/Basic/team.schema";
import { factionSchema } from "../schemas/Basic/faction.schema";

// 1. Créer un challenge
export const createChallenge = async (
    title: string, 
    description: string, 
    category: string, 
    points: number, 
    created_by: number 
) => {
    const challengeValues = {
        title, 
        description, 
        category, 
        points, 
        created_by
    };
    const result = await db.insert(challengeSchema).values(challengeValues).returning();
    return result[0];
};

// 2. Supprimer un challenge
export const deleteChallenge = async (challengeId: number) => {
    // Récupère le challenge depuis la base de données
    const challenge = await db.select().from(challengeSchema).where(eq(challengeSchema.id, challengeId));
    if (!challenge[0]) throw new Error("Challenge introuvable");

    // Supprime les validations et les points associés à ce challenge
    await db.delete(challengeValidationSchema).where(eq(challengeValidationSchema.challenge_id, challengeId));

    // Supprime le challenge de la base de données
    await db.delete(challengeSchema).where(eq(challengeSchema.id, challengeId));

    return { message: `Challenge avec ID ${challengeId} supprimé` };
};

// 3. Récupérer tous les challenges
export const getAllChallenges = async () => {
    return await db.select().from(challengeSchema);
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
    // 1. Récupérer le challenge
    const challenge = await db.select().from(challengeSchema).where(eq(challengeSchema.id, challengeId));
    if (!challenge[0]) throw new Error("Challenge introuvable");

    // 2. Déterminer le team_id et faction_id en fonction du type
    let target_team_id = null;
    let target_faction_id = null;

    switch(type) {
        case "user":
            target_team_id = await team_service.getUserTeam(targetId);
            target_faction_id = await team_service.getTeamFaction(target_team_id);
            break;
        case "team":
            target_faction_id = await team_service.getTeamFaction(targetId);
            if(target_faction_id === 0)throw new Error("Il n'y a pas de faction associée");
            break;
        case "faction":
            target_faction_id = targetId;
            break;
        default:
            throw new Error("Type de challenge non valide");
    }

    // 3. Créer l'objet de validation du challenge
    const newChallengeValidationPoints = {
        challenge_id: challengeId,
        validated_by_admin_id: validatedBy,
        validated_at: new Date(),
        points: challenge[0].points,
        added_by_admin_id: validatedBy,
        target_user_id: type === "user" ? targetId : null,
        target_team_id: target_team_id ? target_team_id : (type === "team" ? targetId : null),
        target_faction_id: target_faction_id,
    };

    // 4. Insérer la validation du challenge dans la base de données
    const inserted = await db.insert(challengeValidationSchema).values(newChallengeValidationPoints).returning();

    return inserted[0];
};

// 5. Ajouter ou retirer des points manuellement
export const modifyFactionPoints = async ({
    factionId,
    points,
    adminId,
}: {
    title : string;
    factionId: number;
    points: number;
    reason: string;
    adminId: number;
    challengeId?: number; // Optional, lié au challenge pour ajouter des points à une faction spécifique
}) => {


    const newChallengeValidationPoints = {
        challenge_id: 5,//TO CHANGE TO 1 IN PROD
        validated_by_admin_id: adminId,
        validated_at: new Date(),
        points: points,
        added_by_admin_id: adminId,
        target_faction_id: factionId,
    };

    // 4. Insérer la validation du challenge dans la base de données
    const insert = await db.insert(challengeValidationSchema).values(newChallengeValidationPoints).returning();


    return insert[0];
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
    // 1. Récupérer le challenge à modifier
    const challenge = await db.select().from(challengeSchema).where(eq(challengeSchema.id, challengeId));
    if (!challenge[0]) throw new Error("Challenge introuvable");

    // 2. Construire l'objet de mise à jour
    const updateValues: any = {};
    if (title) updateValues.title = title;
    if (description) updateValues.description = description;
    if (category) updateValues.category = category;
    if (points !== undefined) updateValues.points = points;

    // 3. Mettre à jour les données du challenge
    const updatedChallenge = await db
        .update(challengeSchema)
        .set(updateValues)
        .where(eq(challengeSchema.id, challengeId))
        .returning();

    // 4. Retourner le challenge mis à jour
    return updatedChallenge[0];
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
    const rowToDelete = await db.select().from(challengeValidationSchema)
    .where(and(
        eq(challengeValidationSchema.challenge_id, challengeId),
        eq(challengeValidationSchema.target_faction_id, factionId),
        // Vérification de la présence de teamId et userId avant de les ajouter à la requête
        ...(teamId ? [eq(challengeValidationSchema.target_team_id, teamId)] : []),
        ...(userId ? [eq(challengeValidationSchema.target_user_id, userId)] : [])
    ))
    .limit(1); // Limite à une seule ligne
    if (rowToDelete.length > 0) {
        await db.delete(challengeValidationSchema)
            .where(eq(challengeValidationSchema.id, rowToDelete[0].id));
    }
;
};


export const getValidatedChallenges = async () => {
    try {
      // Effectuer une jointure entre les tables pour récupérer toutes les informations pertinentes
      const validatedChallenges = await db
        .select({
          challenge_id: challengeValidationSchema.challenge_id,
          challenge_name : challengeSchema.title,
          challenge_categorie : challengeSchema.category,
          challenge_descrpition : challengeSchema.description,
          points: challengeValidationSchema.points,
          validated_at: challengeValidationSchema.validated_at,
          target_user_id: challengeValidationSchema.target_user_id,
          target_team_id: challengeValidationSchema.target_team_id,
          target_faction_id: challengeValidationSchema.target_faction_id,
          target_user_firstname: userSchema.first_name,  // ou d'autres champs de user
          target_user_lastname: userSchema.last_name,
          target_team_name: teamSchema.name,  // ou d'autres champs de team
          target_faction_name: factionSchema.name,  // ou d'autres champs de faction
        })
        .from(challengeValidationSchema)
        .leftJoin(challengeSchema, eq(challengeValidationSchema.challenge_id, challengeSchema.id))
        .leftJoin(userSchema, and(eq(challengeValidationSchema.target_user_id, userSchema.id), isNotNull(challengeValidationSchema.target_user_id)))
        .leftJoin(teamSchema, and(eq(challengeValidationSchema.target_team_id,(teamSchema.id)), isNotNull(challengeValidationSchema.target_team_id)))
        .leftJoin(factionSchema, and(eq(challengeValidationSchema.target_faction_id, factionSchema.id), isNotNull(challengeValidationSchema.target_faction_id)))
        .orderBy(desc(challengeValidationSchema.validated_at));  // Trier par date de validation (si nécessaire)
  
      // Retourner les résultats
      return validatedChallenges;
    } catch (error) {
      console.error("Error retrieving validated challenges:", error);
      throw new Error("Error retrieving validated challenges");
    }
};


export const getTotalFactionPoints = async (factionId: number): Promise<number> => {
    try {
      const result = await db
        .select({
          totalPoints: sum(challengeValidationSchema.points) // Somme des points
           , // Filtre par l'ID de la faction
        })
        .from(challengeValidationSchema).where(eq(challengeValidationSchema.target_faction_id, factionId));
  
      // Récupérer le total des points
      const totalPoints = Number(result[0]?.totalPoints) || 0;
      return totalPoints;
    } catch (error) {
      console.error("Erreur lors de la récupération des points de la faction:", error);
      throw new Error("Impossible de récupérer les points de la faction");
    }
  };