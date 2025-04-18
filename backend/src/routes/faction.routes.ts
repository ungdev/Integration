import express from 'express';
import * as factionController from '../controllers/faction.controller';
import { checkRole } from '../middlewares/user.middleware';

const factionRouter = express.Router();

factionRouter.get("/factions",checkRole("Admin") ,factionController.getFactions);
factionRouter.get("/faction",checkRole("Admin") ,factionController.getFaction);
factionRouter.post("/createfaction",checkRole("Admin") ,factionController.createFaction);
factionRouter.delete("/deletefaction",checkRole("Admin") ,factionController.deleteFaction);


export default factionRouter;