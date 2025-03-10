import express from "express";
import * as roleController from "../controllers/role.controller";
import { authenticateUser } from "../middlewares/auth.middleware"; // Middleware pour vérifier l'authentification
import { checkRole } from "../middlewares/user.middleware";

const roleRouter = express.Router();

roleRouter.put("/updateuserpreferences", authenticateUser, roleController.updateUserPreferences);
roleRouter.get("/userpreferences", authenticateUser,roleController.getUserPreferences)

roleRouter.get("/getroles", authenticateUser, checkRole("admin"), roleController.getRoles)
roleRouter.get("/userbyrolehandler/:roleName", authenticateUser, checkRole("admin"), roleController.getUsersByRoleHandler)
roleRouter.get("/userswithroles", authenticateUser, checkRole("admin"), roleController.getUsersWithRoles)
roleRouter.post("/addroletouser", authenticateUser, checkRole("admin"), roleController.addRoleToUser)
roleRouter.delete("/deleteroletouser", authenticateUser, checkRole("admin"), roleController.deleteRoleToUser)

export default roleRouter;
