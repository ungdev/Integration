import * as permanence_service from '../services/permanence.service';
import { Error, Ok } from '../shared/http/responses';
import type { AppRequestHandler } from '../types/http';
import type { PermanenceBody, PermQuery } from '../dto/permanence.dto';

// Validation des données de permanence
const validatePermanenceData = (start_at: string, end_at: string) => {
    const startDate = new Date(start_at);
    const endDate = new Date(end_at);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return { valid: false, msg: 'Les dates de début et de fin doivent être valides' };
    }

    if (startDate >= endDate) {
        return { valid: false, msg: 'La date de début doit être avant la date de fin' };
    }

    return { valid: true };
};

// ➕ Créer une permanence
export const createPermanence: AppRequestHandler<PermanenceBody> = async (req, res) => {
    const { name, description, location, start_at, end_at, capacity, difficulty, respoId } = req.body;

    if (!name || !location || !start_at || !end_at || !capacity || !difficulty) {
        Error(res, { msg: 'Tous les champs sont requis' });
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
            Number(capacity),
            Number(difficulty),
            Number(respoId),
        );
        Ok(res, { msg: 'Permanence créée avec succès' });
        return;
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de la création de la permanence' });
    }
};

export const updatePermanence: AppRequestHandler<PermanenceBody> = async (req, res) => {
    const { permId, name, description, location, start_at, end_at, capacity, difficulty, respoId } = req.body;

    const validation = validatePermanenceData(start_at, end_at);
    if (!validation.valid) {
        Error(res, { msg: validation.msg });
        return;
    }

    try {
        const permIdNumber = Number(permId);
        const respoIdNumber = Number(respoId);
        const perm = await permanence_service.getPermanenceById(permIdNumber);

        await permanence_service.updatePermanence(
            permIdNumber || perm.id,
            name ?? perm.name,
            description ?? perm.description,
            location ?? perm.location,
            start_at ? new Date(start_at) : perm.start_at,
            end_at ? new Date(end_at) : perm.end_at,
            capacity !== undefined ? Number(capacity) : perm.capacity,
            difficulty !== undefined ? Number(difficulty) : perm.difficulty,
            respoIdNumber,
        );

        Ok(res, { msg: 'Permanence mise à jour avec succès' });
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de la mise à jour de la permanence' });
    }
};

// ➕ Créer une permanence
export const deletePermanence: AppRequestHandler<unknown, PermQuery> = async (req, res) => {
    const { permId } = req.query;

    try {
        await permanence_service.deletePermanence(Number(permId));
        Ok(res, { msg: 'Permanence supprimée avec succès' });
        return;
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de la suppression de la permanence' });
    }
};

// ➡️ Ouvrir une permanence
export const openPermanence: AppRequestHandler<PermanenceBody> = async (req, res) => {
    const { permId } = req.body;

    if (!permId) {
        Error(res, { msg: "L'ID de la permanence est requis" });
        return;
    }

    try {
        const permIdNumber = Number(permId);
        const permanence = await permanence_service.getPermanenceById(permIdNumber);
        if (permanence.is_open === true) {
            Error(res, { msg: 'La permanence est déjà ouverte' });
            return;
        }

        await permanence_service.openPermanence(permIdNumber);
        Ok(res, { msg: 'Permanence ouverte avec succès' });
    } catch (err) {
        console.error(err);
        Error(res, { msg: "Erreur lors de l'ouverture de la permanence" });
    }
};

// ➡️ Fermer une permanence
export const closePermanence: AppRequestHandler<PermanenceBody> = async (req, res) => {
    const { permId } = req.body;

    if (!permId) {
        Error(res, { msg: "L'ID de la permanence est requis" });
        return;
    }

    try {
        const permIdNumber = Number(permId);
        const permanence = await permanence_service.getPermanenceById(permIdNumber);
        if (permanence.is_open === false) {
            Error(res, { msg: 'La permanence est déjà fermée' });
            return;
        }

        await permanence_service.closePermanence(permIdNumber);
        Ok(res, { msg: 'Permanence fermée avec succès' });
        return;
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de la fermeture de la permanence' });
        return;
    }
};

// ➕ S'inscrire à une permanence
export const applyToPermanence: AppRequestHandler<PermanenceBody> = async (req, res) => {
    const { permId } = req.body;
    const userId = req.user?.userId;

    if (!userId || !permId) {
        Error(res, { msg: 'Requête invalide, permId ou userId manquant' });
        return;
    }

    try {
        const permIdNumber = Number(permId);
        const permanence = await permanence_service.getPermanenceById(permIdNumber);
        if (permanence.is_open === false) {
            Error(res, { msg: 'La permanence est fermée, vous ne pouvez pas vous y inscrire' });
            return;
        }

        await permanence_service.registerUserToPermanence(Number(userId), permIdNumber);
        Ok(res, { msg: 'Inscription réussie' });
        return;
    } catch (err) {
        console.error(err);
        Error(res, { msg: err.message || "Erreur pendant l'inscription" });
        return;
    }
};

// ❌ Se désinscrire d'une permanence
export const leavePermanence: AppRequestHandler<PermanenceBody> = async (req, res) => {
    const { permId } = req.body;
    const userId = req.user?.userId;

    if (!userId || !permId) {
        Error(res, { msg: 'Requête invalide, permId ou userId manquant' });
        return;
    }

    try {
        await permanence_service.unregisterUserFromPermanence(Number(userId), Number(permId));
        Ok(res, { msg: 'Désinscription réussie' });
        return;
    } catch (err) {
        console.error(err);
        Error(res, { msg: err.message || 'Erreur pendant la désinscription' });
        return;
    }
};

// 👤 Voir ses permanences
export const getMyPermanences: AppRequestHandler = async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        Error(res, { msg: 'Utilisateur non identifié' });
        return;
    }

    try {
        const list = await permanence_service.getMyPermanences(Number(userId));
        Ok(res, { data: list });
        return;
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur pendant la récupération des permanences' });
        return;
    }
};

// ✅ Récupérer toutes les permanences
export const getAllPermanences: AppRequestHandler = async (_req, res) => {
    try {
        const permanences = await permanence_service.getAllPermanences();
        Ok(res, { data: permanences });
        return;
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de la récupération des permanences' });
        return;
    }
};

// ✅ Récupérer les permanences ouvertes
export const getOpenPermanences: AppRequestHandler = async (_req, res) => {
    try {
        const perms = await permanence_service.listOpenPermanences();
        Ok(res, { data: perms });
        return;
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de la récupération des permanences ouvertes' });
        return;
    }
};

export const getUsersInPermanence: AppRequestHandler<unknown, PermQuery> = async (req, res) => {
    try {
        const { permId } = req.query;
        const users = await permanence_service.getUsersInPermanence(Number(permId));
        Ok(res, { data: users });
        return;
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de la récupération des utilisateurs par permanences' });
        return;
    }
};

export const addUserToPermanence: AppRequestHandler<PermanenceBody> = async (req, res) => {
    const { permId, userId } = req.body;

    if (!userId || !permId) {
        Error(res, { msg: 'Requête invalide, permId ou userId manquant' });
        return;
    }

    try {
        await permanence_service.addUserToPermanence(Number(userId), Number(permId));
        Ok(res, { msg: 'Inscription réussite' });
        return;
    } catch (err) {
        console.error(err);
        Error(res, { msg: err.message || "Erreur pendant l'inscription" });
        return;
    }
};

export const removeUserToPermanence: AppRequestHandler<PermanenceBody> = async (req, res) => {
    const { permId, userId } = req.body;

    if (!userId || !permId) {
        Error(res, { msg: 'Requête invalide, permId ou userId manquant' });
        return;
    }

    try {
        await permanence_service.removeUserToPermanence(Number(userId), Number(permId));
        Ok(res, { msg: 'Désinscription réussite' });
        return;
    } catch (err) {
        console.error(err);
        Error(res, { msg: err.message || 'Erreur pendant la désinscription' });
        return;
    }
};

export const uploadPermanencesCSV: AppRequestHandler = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            Error(res, { msg: 'Fichier CSV manquant.' });
        }

        await permanence_service.importPermanencesFromCSV(file.path);
        Ok(res, { msg: 'Importation réalisée avec succès.' });
    } catch (error) {
        console.error('Erreur import CSV :', error);
        Error(res, { msg: "Échec de l'importation." });
    }
};

export const isUserRespo: AppRequestHandler<unknown, PermQuery> = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        Error(res, { msg: 'userId est requis' });
        return;
    }

    try {
        const isRespo = await permanence_service.isUserRespoOfPermanence(Number(userId));
        Ok(res, { data: isRespo });
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de la vérification du responsable' });
    }
};

export const getRespoPermanencesWithMembers: AppRequestHandler = async (req, res) => {
    const respoId = req.user?.userId;

    if (!respoId) {
        Error(res, { msg: 'respoId est requis' });
        return;
    }

    try {
        const data = await permanence_service.getPermanenceDetailsForRespo(Number(respoId));
        Ok(res, { data });
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de la récupération des permanences du responsable' });
    }
};

export const claimMember: AppRequestHandler<PermanenceBody> = async (req, res) => {
    const { userId, permId, claimed } = req.body;

    if (userId === undefined || permId === undefined || claimed === undefined) {
        Error(res, { msg: 'userId, permId et claimed sont requis' });
        return;
    }

    try {
        await permanence_service.claimMember(Number(userId), Number(permId), Boolean(claimed));
        Ok(res, {
            msg: `Statut mis à jour avec succès (claimed = ${claimed})`,
        });
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de la mise à jour du statut du membre' });
    }
};

export const sendHourlyNotificationToUsers: AppRequestHandler = async (_req, res) => {
    const notifications = await permanence_service.getHourlyNotifications();

    if (notifications.length === 0) {
        Ok(res, { msg: 'Aucune notification horaire à envoyer.' });
        return;
    }

    await permanence_service.sendNotifications(notifications);

    Ok(res, { msg: 'Notifications horaires envoyées avec succès' });
};

export const sendDailyNotificationToUsers: AppRequestHandler = async (_req, res) => {
    const notifications = await permanence_service.getDailyNotifications();

    if (notifications.length === 0) {
        Ok(res, { msg: 'Aucune notification quotidienne à envoyer.' });
        return;
    }

    permanence_service.sendNotifications(notifications);

    Ok(res, { msg: 'Notifications quotidiennes envoyées avec succès' });
};

export const sendConcurrentPermanenceNotifications: AppRequestHandler = async (_req, res) => {
    try {
        const notifications = await permanence_service.getConcurrentPermanenceNotifications();
        await permanence_service.sendConcurrentPermanenceNotifications(notifications);
        Ok(res, { msg: `${notifications.length} notification(s) de conflit envoyée(s).` });
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de l’envoi des notifications de permanences concurrentes' });
    }
};

export const purgeConcurrentPermanences: AppRequestHandler = async (_req, res) => {
    try {
        const result = await permanence_service.purgeConcurrentPermanences();
        Ok(res, {
            data: result,
            msg: `${result.removedRegistrations} inscription(s) supprimée(s) pour ${result.affectedUsers} utilisateur(s).`,
        });
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de la purge des permanences concurrentes' });
    }
};

export const getConcurrentPermanences: AppRequestHandler = async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        Error(res, { msg: 'Utilisateur non identifié' });
        return;
    }

    try {
        const status = await permanence_service.getConcurrentPermanencesStatus(Number(userId));
        Ok(res, { data: status });
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de la vérification des permanences concurrentes' });
    }
};
