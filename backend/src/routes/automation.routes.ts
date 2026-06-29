import express from "express";
import * as permanenceController from "../controllers/permanence.controller";


const automationRoutes = express.Router();

// Permanences routes
automationRoutes.post("/permanence/notification/hourly", permanenceController.sendHourlyNotificationToUsers);
automationRoutes.post("/permanence/notification/daily", permanenceController.sendDailyNotificationToUsers);

export default automationRoutes;
