import { Request, Response, NextFunction } from "express";
import { Error } from "../utils/responses";
import { isUserRespoOfPermanence } from "../services/permanence.service";

export const isRespoMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.userId;

  if (!userId) {
    Error(res, { msg: "Utilisateur ou permanence non spécifié" });
    return;
  }

  try {
    const isRespo = await isUserRespoOfPermanence(userId);
    if (!isRespo) {
      Error(res, { msg: "Accès refusé : vous n'êtes pas responsable d'une permanence" });
      return;
    }

    next(); // ✅ L'utilisateur est bien respo, on continue
  } catch (err) {
    console.error(err);
    Error(res, { msg: "Erreur lors de la vérification du responsable" });
  }
};