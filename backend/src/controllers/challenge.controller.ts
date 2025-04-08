import { Request, Response } from "express";
import { Ok, Error, Unauthorized, Created } from "../utils/responses";
import * as challenge_service from "../services/challenge.service";

// === ADMIN PANEL ===

export const createChallenge = async (req: Request, res: Response) => {
  const { title, description, category, points } = req.body;
  const adminId = req.user.userId;

  try {
    const challenge = await challenge_service.createChallenge(title, description, category, points, adminId );
    Created(res, { msg: "Challenge créé avec succès", data: challenge });
  } catch (err) {
    Error(res, { msg: "Erreur lors de la création du challenge : " + err });
  }
};

export const deleteChallenge = async (req: Request, res: Response) => {
    const { challengeId } = req.query;
  
    try {
      await challenge_service.deleteChallenge(Number(challengeId));
      Ok(res, { msg: "Challenge supprimée avec succès"});
    } catch (err) {
      Error(res, { msg: "Erreur lors de la suppression du challenge : " + err });
    }
  };

export const validateChallenge = async (req: Request, res: Response) => {
  const adminId = req.user.userId;
  const { challengeId, type, targetId } = req.body;

  if (!["user", "team", "faction"].includes(type)) {
    return Unauthorized(res, { msg: "Type de validation invalide." });
  }

  try {
    const validation = await challenge_service.validateChallenge({ challengeId, type, targetId, validatedBy: adminId });
    Ok(res, { msg: "Challenge validé avec succès", data: validation });
  } catch (err) {
    Error(res, { msg: "Erreur lors de la validation du challenge : " + err });
  }
};
export const unvalidateChallenge = async (req: Request, res: Response) => {
    const { challengeId, factionId, teamId, userId } = req.body;

    teamId ? teamId : null
    userId ? userId : null

    try {
      const unvalidation = await challenge_service.unvalidateChallenge({challengeId, factionId, teamId, userId});
      Ok(res, { msg: "Challenge invalidé avec succès", data: unvalidation });
    } catch (err) {
      Error(res, { msg: "Erreur lors de l'invalidation du challenge : " + err });
    }
};

export const addPointsToFaction = async (req: Request, res: Response) => {
  const adminId = req.user.userId;
  const { title, factionId, points, reason } = req.body;

  try {
    const result = await challenge_service.modifyFactionPoints({title, factionId, points, reason, adminId });
    Ok(res, { msg: "Points ajoutés à la faction", data: result });
  } catch (err) {
    Error(res, { msg: "Erreur lors de l'ajout de points : " + err });
  }
};

export const removePointsFromFaction = async (req: Request, res: Response) => {
  const adminId = req.user.userId;
  const { title, factionId, points, reason } = req.body;

  try {
    const result = await challenge_service.modifyFactionPoints({ title, factionId, points: -Math.abs(points), reason, adminId });
    Ok(res, { msg: "Points retirés à la faction", data: result });
  } catch (err) {
    Error(res, { msg: "Erreur lors du retrait de points : " + err });
  }
};

export const updateChallenge = async (req: Request, res: Response) => {
    const { id, title, description, category, points } = req.body;
    try {
      const updated = await challenge_service.modifyChallenge({
        challengeId: id,
        title,
        description,
        category,
        points,
      });
      Ok(res, { msg: "Challenge mis à jour avec succès", data: updated });
    } catch (err) {
      Error(res, { msg: "Erreur lors de la mise à jour : " + err });
    }
};
export const getValidatedChallenges = async (req: Request, res: Response) => {

    try{
        const challengesValidated = await challenge_service.getValidatedChallenges();
        Ok(res, { data: challengesValidated });
    }catch(err){
        Error(res, { msg: "Erreur lors de la récupération des challenges validés " + err });
    }
};

  

// === PUBLIC ===

export const getAllChallenges = async (req: Request, res: Response) => {
  try {
    const challenges = await challenge_service.getAllChallenges();
    Ok(res, { data: challenges });
  } catch (err) {
    Error(res, { msg: "Erreur lors de la récupération des challenges : " + err });
  }
};

export const getTotalFactionPoints = async (req: Request, res: Response) => {

    const {factionId} = req.query;

    try {
      const points = await challenge_service.getTotalFactionPoints(Number(factionId));
      Ok(res, { data: points });
    } catch (err) {
      Error(res, { msg: "Erreur lors de la récupération des points : " + err });
    }
};


