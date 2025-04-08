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

export const createFaction = async (req: Request, res: Response) => {

    
    const {factionName} = req.body
    try {
        const faction = await faction_service.createFaction(factionName);
        Ok(res, { msg: "Faction crée avec succès !" });
        return;

    } catch (error) {
        Error(res, { msg: "Erreur lors de la création de la faction" });
    }
};

export const deleteFaction = async (req: Request, res: Response) => {

    const {factionId} = req.query

    try {
        await faction_service.deleteFaction(Number(factionId));
        Ok(res, { msg: "Faction supprimée avec succès !" });
        return;

    } catch (error) {
        Error(res, { msg: "Erreur lors de la suppression de la faction" });
    }
};