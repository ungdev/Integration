import { Router } from "express";
import multer from "multer";
import * as busController from "../controllers/bus.controller";
import { checkRole } from "../middlewares/user.middleware";

const busRouter = Router();
const upload = multer({ dest: "uploads/buscsv/" });

busRouter.post("/admin/attributionemail", checkRole("Admin", []), busController.sendBusAttributionEmails);
busRouter.post("/admin/importbus", checkRole("Admin", ["Respo CE"]), upload.single("file"), busController.uploadbusCSV);

export default busRouter;
