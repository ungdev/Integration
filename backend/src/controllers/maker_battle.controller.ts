import * as maker_battle_service from '../services/maker_battle.service';
import type { AppRequestHandler } from '../types/http';
import { Error, Ok } from '../shared/http/responses';
import type { Group, GroupsList } from '../dto/maker_battle.dto';

export const distributeGroups: AppRequestHandler<GroupsList> = async (req, res) => {
    const groups = req.body.groups;
    if (!groups || !Array.isArray(groups)) {
        return Error(res, { msg: 'Invalid request: groups must be an array' });
    }

    try {
        for (const group of groups) {
            await maker_battle_service.distributeGroups(group);
        }
        await maker_battle_service.placeTeamsOnTables(groups);

        Ok(res, { data: { success: true, message: 'Groups allocated successfully' } });
        return;
    } catch (err) {
        return Error(res, { msg: 'Erreur lors de la distribution des groupes : ' + err });
    }
};

export const exportGroups: AppRequestHandler<Group> = async (req, res) => {
    const { group } = req.params;
    if (!group || typeof group !== 'string') {
        return Error(res, { msg: 'Invalid request: group must be a string' });
    }

    try {
        const exportData = await maker_battle_service.exportGroups(group);

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="maker_battle_${group}_${Date.now()}.json"`);

        Ok(res, { data: exportData });
        return;
    } catch (err) {
        return Error(res, { msg: "Erreur lors de l'exportation des groupes : " + err });
    }
};

export const getCurrentUser: AppRequestHandler = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return Error(res, { msg: 'User not authenticated' });
        }

        const userGroup = await maker_battle_service.getUserTeam(userId);

        Ok(res, { data: { group: userGroup ?? null } });
        return;
    } catch (err) {
        return Error(res, {
            msg: "Erreur lors de la récupération du groupe de l'utilisateur : " + err,
        });
    }
};
