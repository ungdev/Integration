import express from 'express';
import * as teamController from '../controllers/team.controller';
import { checkRole } from '../middlewares/user.middleware';
import { authenticateUser } from '../middlewares/auth.middleware';

const teamRouter = express.Router();


//User routes
teamRouter.post("/user/create",checkRole("Student") ,teamController.createNewTeam);

//Admin Routes
teamRouter.post("/admin/createlight",checkRole("Admin", ["Respo CE"]) ,teamController.createNewTeamLight);
teamRouter.get("/admin/teams",checkRole("Admin", ["Respo CE", "Arbitre"]) ,teamController.getTeams);
teamRouter.get("/admin/teamswithfactions",checkRole("Admin", ["Respo CE"]) ,teamController.getTeamsWithfactions);
teamRouter.get("/admin/teamfaction",checkRole("Admin", ["Respo CE"]) ,teamController.getTeamFaction);
teamRouter.get("/admin/teamswithusers",checkRole("Admin", ["Respo CE"]) ,teamController.getAllTeamsWithUsers);
teamRouter.put("/admin/modify",checkRole("Admin", ["Respo CE"]) ,teamController.modifyTeam);
teamRouter.get("/admin/teamusers",checkRole("Admin", ["Respo CE"]) ,teamController.getTeamUsers);
teamRouter.delete("/admin/delete",checkRole("Admin", ["Respo CE"]) ,teamController.deleteTeam);
teamRouter.post('/admin/distributeteam',checkRole("Admin"), teamController.teamDistribution);


export default teamRouter;