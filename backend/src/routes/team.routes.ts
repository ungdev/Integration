import express from 'express';
import * as teamController from '../controllers/team.controller';
import { checkRole } from '../middlewares/user.middleware';
import { authenticateUser } from '../middlewares/auth.middleware';

const teamRouter = express.Router();

teamRouter.post("/create",checkRole("Student") ,teamController.createNewTeam);
teamRouter.post("/createlight",checkRole("Admin") ,teamController.createNewTeamLight);
teamRouter.get("/teams",checkRole("Admin") ,teamController.getTeams);
teamRouter.get("/teamfaction",checkRole("Admin") ,teamController.getTeamFaction);
teamRouter.put("/modify",checkRole("Admin") ,teamController.modifyTeam);
teamRouter.get("/teamusers",checkRole("Admin") ,teamController.getTeamUsers);
teamRouter.delete("/delete",checkRole("Admin") ,teamController.deleteTeam);
teamRouter.post('/distributeteam',checkRole("Admin"), teamController.teamDistribution);


export default teamRouter;