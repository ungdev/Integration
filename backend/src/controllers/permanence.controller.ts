import { Request, Response } from "express";
import * as permanence_service from "../services/permanence.service";
import { Ok, Error } from "../utils/responses";

// Validation des données de permanence
const validatePermanenceData = (start_at: string, end_at: string) => {
  const startDate = new Date(start_at);
  const endDate = new Date(end_at);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return { valid: false, msg: "Les dates de début et de fin doivent être valides" };
  }

  if (startDate >= endDate) {
    return { valid: false, msg: "La date de début doit être avant la date de fin" };
  }

  return { valid: true };
};

// ➕ Créer une permanence
export const createPermanence = async (req: Request, res: Response) => {
  const { name, description, location, start_at, end_at, capacity } = req.body;

  if (!name || !location || !start_at || !end_at || !capacity) {
    Error(res, { msg: "Tous les champs sont requis" });
    return;
  }

  const validation = validatePermanenceData(start_at, end_at);
  if (!validation.valid) {
    Error(res, { msg: validation.msg });
    return;
  }

  try {
    await permanence_service.createPermanence(
      name,
      description,
      location,
      new Date(start_at),
      new Date(end_at),
      Number(capacity)
    );
    Ok(res, { msg: "Permanence créée avec succès" });
    return;
  } catch (err) {
    console.error(err);
    Error(res, { msg: "Erreur lors de la création de la permanence" });
  }
};


export const updatePermanence = async (req: Request, res: Response) => {
    const { permId, name, description, location, start_at, end_at, capacity } = req.body;
  
    if (!name || !location || !start_at || !end_at || !capacity) {
      Error(res, { msg: "Tous les champs sont requis" });
      return;
    }
  
    const validation = validatePermanenceData(start_at, end_at);
    if (!validation.valid) {
      Error(res, { msg: validation.msg });
      return;
    }
  
    try {
      await permanence_service.updatePermanence(
        permId,
        name,
        description,
        location,
        new Date(start_at),
        new Date(end_at),
        Number(capacity)
      );
      Ok(res, { msg: "Permanence mis à jour avec succès" });
    } catch (err) {
      console.error(err);
      Error(res, { msg: "Erreur lors de la création de la permanence" });
    }
  };

// ➡️ Ouvrir une permanence
export const openPermanence = async (req: Request, res: Response) => {
  const { permId } = req.body;

  if (!permId) {
    Error(res, { msg: "L'ID de la permanence est requis" });
    return;
  }

  try {
    const permanence = await permanence_service.getPermanenceById(permId);
    if (permanence.is_open === true) {
      Error(res, { msg: "La permanence est déjà ouverte" });
      return;
    }

    await permanence_service.openPermanence(Number(permId));
    Ok(res, { msg: "Permanence ouverte avec succès" });
  } catch (err) {
    console.error(err);
    Error(res, { msg: "Erreur lors de l'ouverture de la permanence" });
  }
};

// ➡️ Fermer une permanence
export const closePermanence = async (req: Request, res: Response) => {
  const { permId } = req.body;

  if (!permId) {
    Error(res, { msg: "L'ID de la permanence est requis" });
    return;
  }

  try {
    const permanence = await permanence_service.getPermanenceById(permId);
    if (permanence.is_open === false) {
      Error(res, { msg: "La permanence est déjà fermée" });
      return;
    }

    await permanence_service.closePermanence(Number(permId));
    Ok(res, { msg: "Permanence fermée avec succès" });
    return;
  } catch (err) {
    console.error(err);
    Error(res, { msg: "Erreur lors de la fermeture de la permanence" });
    return;
  }
};

// ➕ S'inscrire à une permanence
export const applyToPermanence = async (req: Request, res: Response) => {
  const { permId } = req.body;
  const userId = req.user?.userId;


  if (!userId || !permId) {
    Error(res, { msg: "Requête invalide, permId ou userId manquant" });
    return;
  }

  try {
    const permanence = await permanence_service.getPermanenceById(permId);
    if (permanence.is_open === false) {
      Error(res, { msg: "La permanence est fermée, vous ne pouvez pas vous y inscrire" });
      return;
    }

    await permanence_service.registerUserToPermanence(Number(userId), Number(permId));
    Ok(res, { msg: "Inscription réussie" });
    return;
  } catch (err) {
    console.error(err);
    Error(res, { msg: err.message || "Erreur pendant l'inscription" });
    return;
  }
};

// ❌ Se désinscrire d'une permanence
export const leavePermanence = async (req: Request, res: Response) => {
  const { permId } = req.body;
  const userId = req.user?.userId;

  if (!userId || !permId) {
    Error(res, { msg: "Requête invalide, permId ou userId manquant" });
    return;
  }

  try {
    await permanence_service.unregisterUserFromPermanence(Number(permId), Number(userId));
    Ok(res, { msg: "Désinscription réussie" });
    return;
  } catch (err) {
    console.error(err);
    Error(res, { msg: err.message || "Erreur pendant la désinscription" });
    return;
  }
};

// 👤 Voir ses permanences
export const getMyPermanences = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    Error(res, { msg: "Utilisateur non identifié" });
    return;
  }

  try {
    const list = await permanence_service.getMyPermanences(Number(userId));
    Ok(res, { data: list });
    return;
  } catch (err) {
    console.error(err);
    Error(res, { msg: "Erreur pendant la récupération des permanences" });
    return;
  }
};

// ✅ Récupérer toutes les permanences
export const getAllPermanences = async (req: Request, res: Response) => {
  try {
    const permanences = await permanence_service.getAllPermanences();
    Ok(res, { data: permanences });
    return;
  } catch (err) {
    console.error(err);
    Error(res, { msg: "Erreur lors de la récupération des permanences" });
    return;
  }
};

// ✅ Récupérer les permanences ouvertes
export const getOpenPermanences = async (req: Request, res: Response) => {
  try {
    const perms = await permanence_service.listOpenPermanences();
    Ok(res, { data: perms });
    return;
  } catch (err) {
    console.error(err);
    Error(res, { msg: "Erreur lors de la récupération des permanences ouvertes" });
    return;
  }
};

export const getUsersInPermanence = async (req: Request, res: Response) => {
    try {
      const {permId} = req.query
      const users = await permanence_service.getUsersInPermanence(Number(permId))
      Ok(res, { data: users });
      return;
    } catch (err) {
      console.error(err);
      Error(res, { msg: "Erreur lors de la récupération des utilisateurs par permanences" });
      return;
    }
};

export const addUserToPermanence = async (req: Request, res: Response) => {

    const { permId, userId } = req.body;
  
    if (!userId || !permId) {
      Error(res, { msg: "Requête invalide, permId ou userId manquant" });
      return;
    }
  
    try {
      await permanence_service.addUserToPermanence(Number(userId), Number(permId));
      Ok(res, { msg: "Inscription réussite" });
      return;
    } catch (err) {
      console.error(err);
      Error(res, { msg: err.message || "Erreur pendant l'inscription" });
      return;
    }
};

export const removeUserToPermanence = async (req: Request, res: Response) => {

    const { permId, userId } = req.body;
  
    if (!userId || !permId) {
      Error(res, { msg: "Requête invalide, permId ou userId manquant" });
      return;
    }
  
    try {
      await permanence_service.removeUserToPermanence(Number(userId), Number(permId));
      Ok(res, { msg: "Désinscription réussite" });
      return;
    } catch (err) {
      console.error(err);
      Error(res, { msg: err.message || "Erreur pendant la désinscription" });
      return;
    }
};


