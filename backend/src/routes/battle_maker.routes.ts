import { Router } from 'express';
import * as makerBattleController from '../controllers/maker_battle.controller';
import { checkRole } from '../middlewares/user.middleware';

const makerBattleRouter = Router();
makerBattleRouter.post('/admin/allocate', checkRole('Admin', []), makerBattleController.distributeGroups);

export default makerBattleRouter;
