import { Request, Response } from 'express';
import * as faction_service from '../services/faction.service';
import { Ok, Error } from '../utils/responses';

export const getFactions = async (req: Request, res: Response) => {

    try {
        const factions = await faction_service.getFactions();
        Ok(res, { data: factions });
        return;

    } catch (error) {
        Error(res, { msg: "Erreur lors de la récupération des factions" });
    }
};

export const getFaction = async (req: Request, res: Response) => {

    const {factionId} = req.query;

    try {
        const faction = await faction_service.getFaction(factionId);
        Ok(res, { data: faction });
        return;

    } catch (error) {
        Error(res, { msg: "Erreur lors de la récupération des factions" });
    }
};