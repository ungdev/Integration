import { generateEmailHtml, sendEmail } from '../services/email.service';
import * as tent_service from '../services/tent.service';
import { getUserById } from '../services/user.service';
import { Error, Ok } from '../shared/http/responses';
import { email_from } from '../shared/secrets/secrets';
import type { AppRequestHandler } from '../types/http';
import type { CreateTentBody, ToggleTentBody } from '../dto/tent.dto';

export const createTent: AppRequestHandler<CreateTentBody> = async (req, res) => {
    const { userId2 } = req.body;
    const userId1 = req.user?.userId; // Créateur = utilisateur connecté

    if (!userId1 || !userId2) {
        Error(res, { msg: 'Identifiants utilisateurs manquants.' });
    }

    try {
        await tent_service.createTent(userId1, userId2);
        Ok(res, { msg: 'Tente réservée avec succès.' });
    } catch (err: any) {
        Error(res, { msg: err.message || 'Erreur lors de la création de la tente.' });
    }
};

export const cancelTent: AppRequestHandler = async (req, res) => {
    const userId1 = req.user?.userId;

    if (!userId1) {
        Error(res, { msg: 'Identifiants utilisateurs manquants.' });
    }

    try {
        await tent_service.cancelTent(userId1);
        Ok(res, { msg: 'Tente annulée.' });
    } catch {
        Error(res, { msg: "Erreur lors de l'annulation." });
    }
};

export const getUserTent: AppRequestHandler = async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) Error(res, { msg: 'Utilisateur non authentifié.' });

    try {
        const tent = await tent_service.getTentByUser(userId);
        Ok(res, { data: tent });
    } catch {
        Error(res, { msg: 'Erreur lors de la récupération.' });
    }
};

export const getAllTentPairs: AppRequestHandler = async (_req, res) => {
    try {
        const tents = await tent_service.getAllTents();
        Ok(res, { data: tents });
    } catch {
        Error(res, { msg: 'Erreur lors de la récupération des binômes.' });
    }
};

export const toggleTentConfirmation: AppRequestHandler<ToggleTentBody> = async (req, res) => {
    const { userId1, userId2, confirmed } = req.body;

    if (!userId1 || !userId2 || typeof confirmed !== 'boolean') {
        Error(res, { msg: 'Paramètres manquants ou invalides.' });
    }

    try {
        // Mise à jour de la tente
        await tent_service.toggleTentConfirmation(userId1, userId2, confirmed);

        // Récupération des infos utilisateurs
        const user1 = await getUserById(userId1);
        const user2 = await getUserById(userId2);

        if (!user1 || !user2) {
            Error(res, { msg: 'Impossible de récupérer les utilisateurs.' });
        }

        // Génération du contenu HTML
        const htmlEmail = generateEmailHtml('templateNotifyTentConfirmation', {
            user1: `${user1.firstName} ${user1.lastName}`,
            user2: `${user2.firstName} ${user2.lastName}`,
            confirmed,
        });

        // Options d'email
        const emailOptions = {
            from: email_from,
            to: [user1.email, user2.email],
            subject: confirmed ? '🎉 Votre tente a été validée !' : '⛺ Votre tente a été invalidée',
            text: '', // optionnel
            html: htmlEmail,
        };

        // Envoi
        await sendEmail(emailOptions);

        Ok(res, {
            msg: confirmed ? 'Tente validée et email envoyé.' : 'Tente invalidée et email envoyé.',
        });
    } catch (err: any) {
        console.error(err);
        Error(res, {
            msg: err.message || "Erreur lors de la mise à jour ou de l'envoi d'email.",
        });
    }
};
