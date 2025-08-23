import express from 'express';
import * as tentController from '../controllers/tent.controller';
import { checkRole } from '../middlewares/user.middleware';

const tentRouter = express.Router();

// Admin routes
tentRouter.get('/admin/tents', checkRole("Admin",[]), tentController.getAllTentPairs);


// User routes
tentRouter.post("/user/tent",checkRole("Nouveau",[]), tentController.createTent);
tentRouter.delete("/user/tent",checkRole("Nouveau",[]), tentController.cancelTent);
tentRouter.get("/user/tent",checkRole("Nouveau",[]), tentController.getUserTent);





export default tentRouter;
