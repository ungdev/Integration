import express from 'express';
import * as teamController from '../controllers/team.controller';
import { checkRole } from '../middlewares/user.middleware';
import { authenticateUser } from '../middlewares/auth.middleware';

const teamRouter = express.Router();

teamRouter.post("/create", authenticateUser,checkRole("Student") ,teamController.createNewTeam);

export default teamRouter;