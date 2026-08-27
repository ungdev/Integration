import * as maker_battle_service from '../services/maker_battle.service';
import type { AppRequestHandler } from '../types/http';
import { Error } from '../shared/http/responses';
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
        return res.status(200).json({ success: true, message: 'Groups allocated successfully' });
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

        return res.status(200).json(exportData);
    } catch (err) {
        return Error(res, { msg: "Erreur lors de l'exportation des groupes : " + err });
    }
};
