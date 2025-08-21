import express from 'express';
import * as imexportController from '../controllers/im_export.controller';
import { checkRole } from '../middlewares/user.middleware';
import {createUploadMiddleware} from "../middlewares/multer.middleware";

const uploadFoodMenu = createUploadMiddleware("uploads/foodmenu/", false);
const uploadPlannings = createUploadMiddleware("uploads/plannings/", false);
const imexportRouter = express.Router();


imexportRouter.post('/admin/foodimport',checkRole("Admin",[]),uploadFoodMenu.multerUpload.single("foodFile"), uploadFoodMenu.verifyAndSave, imexportController.updateFoodMenu)
imexportRouter.post('/admin/plannings',checkRole("Admin",[]),uploadPlannings.multerUpload.single("planningFile"), uploadFoodMenu.verifyAndSave, imexportController.updatePlannings)
imexportRouter.post('/admin/export',checkRole("Admin",[]), imexportController.exportAllDataToSheets)




export default imexportRouter;
