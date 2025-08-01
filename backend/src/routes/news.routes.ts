import express from "express";
import * as newsController from "../controllers/news.controller";
import { checkRole } from "../middlewares/user.middleware";
import upload from "../middlewares/multer.middleware";

const newsRouter = express.Router();

//Admin routes
newsRouter.post("/admin/createnews",checkRole("Admin",["Communication & Graphisme"]), upload.single("file"),  newsController.createNews);
newsRouter.get("/admin/all",checkRole("Admin",["Communication & Graphisme"]), newsController.listAllNews);
newsRouter.post("/admin/publish",checkRole("Admin",["Communication & Graphisme"]) , newsController.publishNews);
newsRouter.delete("/admin/deletenews",checkRole("Admin",["Communication & Graphisme"]) ,newsController.deleteNews);
newsRouter.post("/admin/updatenews", checkRole("Admin", ["Communication & Graphisme"]), upload.single("file"), newsController.updateNews);


//User routes
newsRouter.get("/user/published", newsController.listPublishedNews);
newsRouter.get("/user/publishedbytype", newsController.listPublishedNewsByType);


export default newsRouter;
