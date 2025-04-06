import express from "express";
import * as roleController from "../controllers/role.controller";
import { authenticateUser } from "../middlewares/auth.middleware"; // Middleware pour vérifier l'authentification
import { checkRole } from "../middlewares/user.middleware";

const roleRouter = express.Router();

roleRouter.put("/updateuserpreferences", roleController.updateUserPreferences);
roleRouter.get("/userpreferences",roleController.getUserPreferences)

roleRouter.get("/getroles", checkRole("Admin"), roleController.getRoles)
roleRouter.get("/userbyrolehandler/:roleName", checkRole("Admin"), roleController.getUsersByRoleHandler)
roleRouter.get("/userswithroles", checkRole("Admin"), roleController.getUsersWithRoles)
roleRouter.get("/getusersroles", checkRole("Admin"), roleController.getUserRoles)
roleRouter.post("/addroletouser", checkRole("Admin"), roleController.addRoleToUser)
roleRouter.delete("/deleteroletouser", checkRole("Admin"), roleController.deleteRoleToUser)


export default roleRouter;
