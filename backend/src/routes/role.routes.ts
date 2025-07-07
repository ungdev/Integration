import express from "express";
import * as roleController from "../controllers/role.controller";
import { authenticateUser } from "../middlewares/auth.middleware"; // Middleware pour vérifier l'authentification
import { checkRole } from "../middlewares/user.middleware";

const roleRouter = express.Router();

//User Routes
roleRouter.put("/user/updateuserpreferences", roleController.updateUserPreferences);
roleRouter.get("/user/userpreferences",roleController.getUserPreferences)


//Admin routes
roleRouter.get("/admin/getroles", checkRole("Admin"), roleController.getRoles)
roleRouter.get("/admin/userbyrolehandler/:roleName", checkRole("Admin"), roleController.getUsersByRoleHandler)
roleRouter.get("/admin/userswithroles", checkRole("Admin"), roleController.getUsersWithRoles)
roleRouter.get("/admin/getusersroles", checkRole("Admin"), roleController.getUserRoles)
roleRouter.post("/admin/addroletouser", checkRole("Admin"), roleController.addRoleToUser)
roleRouter.delete("/admin/deleteroletouser", checkRole("Admin"), roleController.deleteRoleToUser)


export default roleRouter;
