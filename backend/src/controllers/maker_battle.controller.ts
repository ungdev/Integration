import * as maker_battle_service from '../services/maker_battle.service';
import type { AppRequestHandler } from '../types/http';
import { Error } from '../shared/http/responses';
import type { MakerBattleDTO } from '../dto/maker_battle.dto';

export const distributeGroups: AppRequestHandler<MakerBattleDTO> = async (req, res) => {
    const groups = req.body.groups;
    if (!groups || !Array.isArray(groups)) {
        return Error(res, { msg: 'Invalid request: groups must be an array' });
    }

    try {
        for (const group of groups) {
            await maker_battle_service.distributeGroups(group);
        }
        return res.status(200).json({ success: true, message: 'Groups allocated successfully' });
    } catch (err) {
        return Error(res, { msg: 'Erreur lors de la distribution des groupes : ' + err });
    }
};
