import express from "express";
import * as permanenceController from "../controllers/permanence.controller";
import { checkRole } from "../middlewares/user.middleware";

const permanenceRouter = express.Router();

// Admin routes
permanenceRouter.post("/admin/permanence", checkRole("Admin"), permanenceController.createPermanence);
permanenceRouter.post("/admin/updatepermanence", checkRole("Admin"), permanenceController.updatePermanence);
permanenceRouter.post("/admin/open", checkRole("Admin"), permanenceController.openPermanence);
permanenceRouter.post("/admin/close", checkRole("Admin"), permanenceController.closePermanence);
permanenceRouter.get("/admin/permanences", checkRole("Admin"), permanenceController.getAllPermanences);
permanenceRouter.get("/admin/users", checkRole("Admin"), permanenceController.getUsersInPermanence);
permanenceRouter.post("/admin/add", checkRole("Admin"), permanenceController.addUserToPermanence);
permanenceRouter.post("/admin/remove", checkRole("Admin"), permanenceController.removeUserToPermanence);

// Student routes
permanenceRouter.get("/student/permanences", checkRole("Student"), permanenceController.getOpenPermanences);
permanenceRouter.post("/student/apply", checkRole("Student"), permanenceController.applyToPermanence);
permanenceRouter.post("/student/leave", checkRole("Student"), permanenceController.leavePermanence);
permanenceRouter.get("/student/me", checkRole("Student"), permanenceController.getMyPermanences );

export default permanenceRouter;
