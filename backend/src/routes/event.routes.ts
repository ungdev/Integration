import express from 'express';
import * as eventController from '../controllers/event.controller';
import { checkRole } from '../middlewares/user.middleware';
import { authenticateUser } from '../middlewares/auth.middleware';

const eventRouter = express.Router();

eventRouter.get("/shotgunstatus",checkRole("Student"), eventController.checkShotgunStatus);
eventRouter.get("/preregisterstatus",checkRole("Student"), eventController.checkPreRegisterStatus);
eventRouter.post("/shotgunattempt",checkRole("Student"), eventController.shotgunAttempt);
eventRouter.post("/shotguntoggle",checkRole("Admin"),eventController.toggleShotgun);
eventRouter.post("/preregistrationtoggle",checkRole("Admin"), eventController.togglePreRegistration);

export default eventRouter;