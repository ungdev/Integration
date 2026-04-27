import express from "express";
import * as newsController from "../controllers/news.controller";
import { checkRole } from "../middlewares/user.middleware";

const newsRouter = express.Router();

//Admin routes
newsRouter.post("/admin/createnews", checkRole("Admin", ["Communication"]), newsController.createNews);
newsRouter.post("/admin/updatenews", checkRole("Admin", ["Communication"]), newsController.updateNews);
newsRouter.get("/admin/all", checkRole("Admin", ["Communication"]), newsController.listAllNews);
newsRouter.post("/admin/publish", checkRole("Admin", ["Communication"]), newsController.publishNews);
newsRouter.delete("/admin/deletenews", checkRole("Admin", ["Communication"]), newsController.deleteNews);

//User routes
newsRouter.get("/user/published", newsController.listPublishedNews);
newsRouter.get("/user/publishedbytype", newsController.listPublishedNewsByType);

export default newsRouter;
