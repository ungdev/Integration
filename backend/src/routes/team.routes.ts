import express from 'express';
import * as teamController from '../controllers/team.controller';
import { checkRole } from '../middlewares/user.middleware';
import { authenticateUser } from '../middlewares/auth.middleware';

const teamRouter = express.Router();


//User routes
teamRouter.post("/user/create",checkRole("Student") ,teamController.createNewTeam);

//Admin Routes
teamRouter.post("/admin/createlight",checkRole("Admin") ,teamController.createNewTeamLight);
teamRouter.get("/admin/teams",checkRole("Admin") ,teamController.getTeams);
teamRouter.get("/admin/teamfaction",checkRole("Admin") ,teamController.getTeamFaction);
teamRouter.put("/admin/modify",checkRole("Admin") ,teamController.modifyTeam);
teamRouter.get("/admin/teamusers",checkRole("Admin") ,teamController.getTeamUsers);
teamRouter.delete("/admin/delete",checkRole("Admin") ,teamController.deleteTeam);
teamRouter.post('/admin/distributeteam',checkRole("Admin"), teamController.teamDistribution);


export default teamRouter;