import express from "express";
import multer from "multer";
import * as permanenceController from "../controllers/permanence.controller";
import { checkRole } from "../middlewares/user.middleware";
import { isRespoMiddleware } from "../middlewares/respoperm.middleware";

const permanenceRouter = express.Router();
const upload = multer({ dest: "uploads/permcsv/" });

// Admin routes
permanenceRouter.post("/admin/permanence", checkRole("Admin",[]), permanenceController.createPermanence);
permanenceRouter.delete("/admin/permanence", checkRole("Admin",[]), permanenceController.deletePermanence);
permanenceRouter.post("/admin/updatepermanence", checkRole("Admin",[]), permanenceController.updatePermanence);
permanenceRouter.post("/admin/open", checkRole("Admin",[]), permanenceController.openPermanence);
permanenceRouter.post("/admin/close", checkRole("Admin",[]), permanenceController.closePermanence);
permanenceRouter.get("/admin/permanences", checkRole("Admin",[]), permanenceController.getAllPermanences);
permanenceRouter.get("/admin/users", checkRole("Admin",[]), permanenceController.getUsersInPermanence);
permanenceRouter.post("/admin/add", checkRole("Admin",[]), permanenceController.addUserToPermanence);
permanenceRouter.post("/admin/remove", checkRole("Admin",[]), permanenceController.removeUserToPermanence);
permanenceRouter.post("/admin/importpermanences",checkRole("Admin",[]), upload.single("file"), permanenceController.uploadPermanencesCSV);

//Respo de perm routes

permanenceRouter.get("/respo/respodetails",isRespoMiddleware, permanenceController.getRespoPermanencesWithMembers);
permanenceRouter.post("/respo/claimedmember",isRespoMiddleware, permanenceController.claimMember);


// Student routes
permanenceRouter.get("/user/permanences", checkRole("Student",[]), permanenceController.getOpenPermanences);
permanenceRouter.post("/user/apply", checkRole("Student",[]), permanenceController.applyToPermanence);
permanenceRouter.post("/user/leave", checkRole("Student",[]), permanenceController.leavePermanence);
permanenceRouter.get("/user/me", checkRole("Student",[]), permanenceController.getMyPermanences );
permanenceRouter.get("/user/isrespo", permanenceController.isUserRespo);
export default permanenceRouter;
