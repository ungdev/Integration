import express from 'express';
import * as eventController from '../controllers/event.controller';
import { checkRole } from '../middlewares/user.middleware';
import { authenticateUser } from '../middlewares/auth.middleware';

const eventRouter = express.Router();

// User routes
eventRouter.get("/user/shotgunstatus",checkRole("Student"), eventController.checkShotgunStatus);
eventRouter.get("/user/preregisterstatus",checkRole("Student"), eventController.checkPreRegisterStatus);
eventRouter.post("/user/shotgunattempt",checkRole("Student"), eventController.shotgunAttempt);

// Admin routes
eventRouter.post("/admin/shotguntoggle",checkRole("Admin"),eventController.toggleShotgun);
eventRouter.post("/admin/preregistrationtoggle",checkRole("Admin"), eventController.togglePreRegistration);

export default eventRouter;