import express from "express";
import * as challengeController from "../controllers/challenge.controller"; // Assure-toi que le contrôleur existe et contient toutes les méthodes nécessaires
import { checkRole } from "../middlewares/user.middleware";

const challengeRouter = express.Router();

// Admin routes
challengeRouter.post("/admin/challenge", checkRole("Admin", ["Arbitre"]), challengeController.createChallenge);
challengeRouter.delete("/admin/delete", checkRole("Admin", ["Arbitre"]), challengeController.deleteChallenge);
challengeRouter.put("/admin/updatechallenge", checkRole("Admin",["Arbitre"]), challengeController.updateChallenge);
challengeRouter.post("/admin/validate", checkRole("Admin", ["Arbitre"]), challengeController.validateChallenge);
challengeRouter.post("/admin/unvalidate",checkRole("Admin", ["Arbitre"]), challengeController.unvalidateChallenge);
challengeRouter.get("/admin/challenges", checkRole("Admin", ["Arbitre"]), challengeController.getAllChallenges);
challengeRouter.get("/admin/validatedchallenges", checkRole("Admin", ["Arbitre"]), challengeController.getValidatedChallenges);
challengeRouter.post("/admin/assignpoints", checkRole("Admin", ["Arbitre"]), challengeController.addPointsToFaction); 


// User routes
challengeRouter.get("/user/challenges", challengeController.getAllChallenges);
challengeRouter.get("/user/factionpoints", challengeController.getTotalFactionPoints); // Liste des challenges disponibles pour un étudiant

export default challengeRouter;
