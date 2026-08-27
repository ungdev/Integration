import { Router } from 'express';
import * as makerBattleController from '../controllers/maker_battle.controller';

const makerBattleRouter = Router();
makerBattleRouter.post('/admin/allocate', makerBattleController.distributeGroups);

export default makerBattleRouter;
