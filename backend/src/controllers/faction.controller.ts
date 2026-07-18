import * as faction_service from '../services/faction.service';
import { Error, Ok } from '../utils/responses';
import type { AppRequestHandler } from '../types/http';
import type { FactionQuery, FactionBody } from '../dto/faction.dto';

export const getFactions: AppRequestHandler = async (_req, res) => {
    try {
        const factions = await faction_service.getFactions();
        Ok(res, { data: factions });
        return;
    } catch {
        Error(res, { msg: 'Erreur lors de la récupération des factions' });
    }
};

export const getFaction: AppRequestHandler<unknown, FactionQuery> = async (req, res) => {
    const { factionId } = req.query;

    try {
        const faction = await faction_service.getFaction(factionId);
        Ok(res, { data: faction });
        return;
    } catch {
        Error(res, { msg: 'Erreur lors de la récupération des factions' });
    }
};

export const createFaction: AppRequestHandler<FactionBody> = async (req, res) => {
    const { factionName } = req.body;

    try {
        await faction_service.createFaction(factionName);
        Ok(res, { msg: 'Faction crée avec succès !' });
        return;
    } catch {
        Error(res, { msg: 'Erreur lors de la création de la faction' });
    }
};

export const deleteFaction: AppRequestHandler<unknown, FactionQuery> = async (req, res) => {
    const { factionId } = req.query;

    try {
        await faction_service.deleteFaction(Number(factionId));
        Ok(res, { msg: 'Faction supprimée avec succès !' });
        return;
    } catch {
        Error(res, { msg: 'Erreur lors de la suppression de la faction' });
    }
};
