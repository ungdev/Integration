import * as banned_service from '../services/banned.service';
import { Error, Ok } from '../utils/responses';
import type { AppRequestHandler } from '../types/http';
import type { BannedBody, BannedIdParams } from '../dto/banned.dto';

export const addBanned: AppRequestHandler<BannedBody> = async (req, res) => {
    const { email } = req.body;

    try {
        const banned = await banned_service.addBanned(email);
        Ok(res, { data: banned });
    } catch (err) {
        console.error(err);
        Error(res, { msg: "Erreur lors de l'ajout de l'addresses bannie." });
    }
};

export const removeBanned: AppRequestHandler<unknown, unknown, BannedIdParams> = async (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return Error(res, { msg: 'ID invalide.' });
    }

    try {
        const banned = await banned_service.removeBanned(id);
        Ok(res, { data: banned });
    } catch (err) {
        console.error(err);
        Error(res, { msg: "Erreur lors de la suppression de l'address bannie." });
    }
};

export const getAllBanned: AppRequestHandler = async (_req, res) => {
    try {
        const banned = await banned_service.getAllBanned();
        Ok(res, { data: banned });
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de la récupération des addresses bannies.' });
    }
};
