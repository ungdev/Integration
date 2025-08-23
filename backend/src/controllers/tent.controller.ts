import { Request, Response } from "express";
import * as tent_service from "../services/tent.service";
import { Error, Ok } from "../utils/responses";

export const createTent = async (req: Request, res: Response) => {
  const { userId2 } = req.body;
  const userId1 = req.user?.userId; // Créateur = utilisateur connecté

  if (!userId1 || !userId2) {
    return Error(res, { msg: "Identifiants utilisateurs manquants." });
  }

  try {
    await tent_service.createTent(userId1, userId2);
    Ok(res, { msg: "Tente réservée avec succès." });
  } catch (err: any) {
    Error(res, { msg: err.message || "Erreur lors de la création de la tente." });
  }
};

export const cancelTent = async (req: Request, res: Response) => {

  const userId1 = req.user?.userId;

  if (!userId1) {
    return Error(res, { msg: "Identifiants utilisateurs manquants." });
  }

  try {
    await tent_service.cancelTent(userId1);
    Ok(res, { msg: "Tente annulée." });
  } catch (err) {
    Error(res, { msg: "Erreur lors de l'annulation." });
  }
};

export const getUserTent = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return Error(res, { msg: "Utilisateur non authentifié." });

  try {
    const tent = await tent_service.getTentByUser(userId);
    Ok(res, { data: tent });
  } catch (err) {
    Error(res, { msg: "Erreur lors de la récupération." });
  }
};

export const getAllTentPairs = async (req: Request, res: Response) => {
  try {
    const tents = await tent_service.getAllTents();
    Ok(res, { data: tents });
  } catch (err) {
    Error(res, { msg: "Erreur lors de la récupération des binômes." });
  }
};
