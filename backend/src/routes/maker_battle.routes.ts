import { Router } from 'express';
import * as makerBattleController from '../controllers/maker_battle.controller';
import { checkRole } from '../middlewares/user.middleware';

const makerBattleRouter = Router();
makerBattleRouter.post('/admin/allocate', checkRole('Admin', ['Défis TC']), makerBattleController.distributeGroups);
makerBattleRouter.get('/admin/export/:group', checkRole('Admin', ['Défis TC']), makerBattleController.exportGroups);

makerBattleRouter.get('/group/me', makerBattleController.getCurrentUser);
export default makerBattleRouter;
