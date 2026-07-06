import { type Request, type Response } from 'express';
import * as banned_service from '../services/banned.service';
import { Error, Ok } from '../utils/responses';

export const addBanned = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const banned = await banned_service.addBanned(email);
        Ok(res, { data: banned });
    } catch (err) {
        console.error(err);
        Error(res, { msg: "Erreur lors de l'ajout de l'addresses bannie." });
    }
};

export const removeBanned = async (req: Request, res: Response) => {
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

export const getAllBanned = async (req: Request, res: Response) => {
    try {
        const banned = await banned_service.getAllBanned();
        Ok(res, { data: banned });
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de la récupération des addresses bannies.' });
    }
};
