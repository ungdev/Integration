import { Router } from 'express';
import * as makerBattleController from '../controllers/maker_battle.controller';
import { checkRole } from '../middlewares/user.middleware';

const makerBattleRouter = Router();
makerBattleRouter.post('/admin/allocate', checkRole('Admin'), makerBattleController.distributeGroups);
makerBattleRouter.get('/admin/export/:group', checkRole('Admin'), makerBattleController.exportGroups);
export default makerBattleRouter;
