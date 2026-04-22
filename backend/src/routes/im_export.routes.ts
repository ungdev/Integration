import express from 'express';
import * as imexportController from '../controllers/im_export.controller';
import { createUploadMiddleware } from "../middlewares/multer.middleware";
import { checkRole } from '../middlewares/user.middleware';

const uploadFoodMenu = createUploadMiddleware("uploads/foodmenu/", false);
const uploadPlannings = createUploadMiddleware("uploads/plannings/", false);
const imexportRouter = express.Router();

imexportRouter.post('/admin/foodimport', checkRole("Admin", []), uploadFoodMenu.multerUpload.single("foodFile"), uploadFoodMenu.verifyAndSave, imexportController.updateFoodMenu);
imexportRouter.post('/admin/plannings', checkRole("Admin", []), uploadPlannings.multerUpload.single("planningFile"), uploadPlannings.verifyAndSave, imexportController.updatePlannings);
imexportRouter.post('/admin/exportgsheet', checkRole("Admin", []), imexportController.exportAllDataToSheets);
imexportRouter.get('/admin/exportbus', checkRole("Admin", []), imexportController.exportUsersCSV);

export default imexportRouter;
