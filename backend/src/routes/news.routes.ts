import express from "express";
import * as newsController from "../controllers/news.controller";
import { checkRole } from "../middlewares/user.middleware";

const newsRouter = express.Router();

//Admin
newsRouter.post("/admin/createnews",checkRole("Admin"),  newsController.createNews);
newsRouter.get("/admin/all",checkRole("Admin"), newsController.listAllNews);
newsRouter.post("/admin/publish",checkRole("Admin") , newsController.publishNews);
newsRouter.delete("/admin/deletenews",checkRole("Admin") ,newsController.deleteNews);
newsRouter.put("/admin/updatenews", checkRole("Admin"), newsController.updateNews);

//User
newsRouter.get("/user/published", newsController.listPublishedNews);
newsRouter.get("/user/publishedbytype", newsController.listPublishedNewsByType);


export default newsRouter;
