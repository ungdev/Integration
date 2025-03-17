import express from 'express';
import * as eventController from '../controllers/event.controller';
import { checkRole } from '../middlewares/user.middleware';
import { authenticateUser } from '../middlewares/auth.middleware';

const eventRouter = express.Router();

eventRouter.get("/shotgunstatus",authenticateUser,checkRole("Student"), eventController.checkShotgunStatus);
eventRouter.get("/preregisterstatus",authenticateUser,checkRole("Student"), eventController.checkPreRegisterStatus);
eventRouter.post("/shotgunattempt",authenticateUser,checkRole("Student"), eventController.shotgunAttempt);
eventRouter.post("/shotguntoggle",authenticateUser,checkRole("admin"),eventController.toggleShotgun);
eventRouter.post("/preregistrationtoggle",authenticateUser,checkRole("admin"), eventController.togglePreRegistration);

export default eventRouter;