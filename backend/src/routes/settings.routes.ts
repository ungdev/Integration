import express from 'express';
import * as settingsController from '../controllers/settings.controller';
import { checkRole } from '../middlewares/user.middleware';

const settingsRouter = express.Router();

// User routes
settingsRouter.get('/user/status', settingsController.getAvailableSettings);
settingsRouter.get('/user/status/:setting', settingsController.getSettingStatus);
settingsRouter.post('/user/shotgunattempt', checkRole('Student', []), settingsController.shotgunAttempt);

// Admin routes
settingsRouter.get('/admin/shotgunattempts', checkRole('Admin', ['Respo CE']), settingsController.getShotgunAttempts);
settingsRouter.get('/admin/settings', checkRole('Admin', []), settingsController.getAdminSettings);
settingsRouter.patch('/admin/status/:setting', checkRole('Admin', []), settingsController.updateSettingStatus);

export default settingsRouter;
