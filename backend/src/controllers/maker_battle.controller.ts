import * as maker_battle_service from '../services/maker_battle.service';
import type { AppRequestHandler } from '../types/http';
import { Error } from '../shared/http/responses';
import type { BattleMakerDTO } from '../dto/battle_maker.dto';

export const distributeGroups: AppRequestHandler<BattleMakerDTO> = async (req, res) => {
    const groups = req.body.groups;
    for (const group of groups) {
        try {
            await maker_battle_service.distributeGroups(group);
        } catch (err) {
            return Error(res, { msg: 'Erreur lors de la distribution des groupes : ' + err });
        }
    }
};
