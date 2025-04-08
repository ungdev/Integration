import express from "express";
import * as challengeController from "../controllers/challenge.controller"; // Assure-toi que le contrôleur existe et contient toutes les méthodes nécessaires
import { checkRole } from "../middlewares/user.middleware";

const challengeRouter = express.Router();

// Admin routes
challengeRouter.post("/admin/challenge", checkRole("Admin"), challengeController.createChallenge);
challengeRouter.delete("/admin/delete", checkRole("Admin"), challengeController.deleteChallenge);
challengeRouter.put("/admin/updatechallenge", checkRole("Admin"), challengeController.updateChallenge);
challengeRouter.post("/admin/validate", checkRole("Admin"), challengeController.validateChallenge);
challengeRouter.post("/admin/unvalidate", checkRole("Admin"), challengeController.unvalidateChallenge);
challengeRouter.get("/admin/challenges", checkRole("Admin"), challengeController.getAllChallenges);
challengeRouter.get("/admin/validatedchallenges", checkRole("Admin"), challengeController.getValidatedChallenges);
challengeRouter.post("/admin/assignpoints", checkRole("Admin"), challengeController.addPointsToFaction); 


// User routes
challengeRouter.get("/user/challenges", checkRole("Student"), challengeController.getAllChallenges);
challengeRouter.get("/user/factionpoints", checkRole("Student"), challengeController.getTotalFactionPoints); // Liste des challenges disponibles pour un étudiant

export default challengeRouter;
