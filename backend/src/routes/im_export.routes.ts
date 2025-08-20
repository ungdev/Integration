import express from 'express';
import * as imexportController from '../controllers/im_export.controller';
import { checkRole } from '../middlewares/user.middleware';
import {createUploadMiddleware} from "../middlewares/multer.middleware";

const uploadFoodMenu = createUploadMiddleware("uploads/foodmenu/", false);
const uploadPlannings = createUploadMiddleware("uploads/plannings/", false);
const imexportRouter = express.Router();


imexportRouter.post('/admin/foodimport',checkRole("Admin",[]),uploadFoodMenu.single("foodFile"), imexportController.updateFoodMenu)
imexportRouter.post('/admin/plannings',checkRole("Admin",[]),uploadPlannings.single("planningFile"), imexportController.updatePlannings)
imexportRouter.post('/admin/export',checkRole("Admin",[]), imexportController.exportAllDataToSheets)




export default imexportRouter;
