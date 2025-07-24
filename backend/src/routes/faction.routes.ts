import express from 'express';
import * as factionController from '../controllers/faction.controller';
import { checkRole } from '../middlewares/user.middleware';

const factionRouter = express.Router();


// Admin routes
factionRouter.get("/admin/factions",checkRole("Admin", ["Respo CE", "Arbitre"]) ,factionController.getFactions);
factionRouter.get("/admin/faction",checkRole("Admin", ["Respo CE"]) ,factionController.getFaction);
factionRouter.post("/admin/createfaction",checkRole("Admin", ["Respo CE"]) ,factionController.createFaction);
factionRouter.delete("/admin/deletefaction",checkRole("Admin", ["Respo CE"]) ,factionController.deleteFaction);

//Student Routes
factionRouter.get("/user/factions",factionController.getFactions);


export default factionRouter;