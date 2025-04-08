import express from 'express';
import * as exportController from '../controllers/export.controller';
import { checkRole } from '../middlewares/user.middleware';

const exportRouter = express.Router();

// Route d'inscription
exportRouter.post('/export',checkRole("Admin"), exportController.exportAllDataToSheets)



export default exportRouter;
