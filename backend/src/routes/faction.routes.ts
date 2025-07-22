import express from 'express';
import * as factionController from '../controllers/faction.controller';
import { checkRole } from '../middlewares/user.middleware';

const factionRouter = express.Router();


// Admin routes
factionRouter.get("/admin/factions",checkRole("Admin") ,factionController.getFactions);
factionRouter.get("/admin/faction",checkRole("Admin") ,factionController.getFaction);
factionRouter.post("/admin/createfaction",checkRole("Admin") ,factionController.createFaction);
factionRouter.delete("/admin/deletefaction",checkRole("Admin") ,factionController.deleteFaction);

//Student Routes
factionRouter.get("/user/factions",factionController.getFactions);


export default factionRouter;