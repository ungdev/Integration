import { Router } from 'express';
import * as bannedController from '../controllers/banned.controller';
import { checkRole } from '../middlewares/user.middleware';

const bannedRouter = Router();

bannedRouter.post('/admin', checkRole('Admin', []), bannedController.addBanned);
bannedRouter.delete('/admin/:id', checkRole('Admin', []), bannedController.removeBanned);
bannedRouter.get('/admin/all', checkRole('Admin', []), bannedController.getAllBanned);

export default bannedRouter;
