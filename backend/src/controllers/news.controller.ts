import { Request, Response } from "express";
import * as news_service from "../services/news.service";
import { Ok, Error } from "../utils/responses";
import * as template from "../utils/emailtemplates";
import * as email_service from "../services/email.service";
import * as user_service from '../services/user.service'
import path from "path";
import fs from "fs";

export const createNews = async (req: Request, res: Response) => {

  
  const { title, description, type, published, target } = req.body;
  const file = req.file;

  try {

    const image_url = file ? `/api/uploads/imgnews/${file.filename}` : undefined;
    const news = await news_service.createNews(
      title, 
      description, 
      type, 
      published, 
      target,
      image_url);
    Ok(res, { msg: "Actu créée avec succès", data: news });
    ;
  } catch (err) {
    console.error(err);
    Error(res, { msg: "Erreur lors de la création de l'actu" });
  }
};

export const listAllNews = async (_req: Request, res: Response) => {
  try {
    const news = await news_service.getAllNews();
    Ok(res, { data: news });
  } catch (err) {
    console.error(err);
    Error(res, { msg: "Erreur lors de la récupération des actus" });
  }
};

export const listPublishedNews = async (_req: Request, res: Response) => {
  try {
    const news = await news_service.getPublishedNews();
    Ok(res, { data: news });
  } catch (err) {
    console.error(err);
    Error(res, { msg: "Erreur lors de la récupération des actus publiées" });
  }
};

export const listPublishedNewsByType = async (req: Request, res: Response) => {

  const { type } = req.query;

  try {
    const news = await news_service.getPublishedNewsByType(type as string);
    Ok(res, { data: news });
  } catch (err) {
    console.error(err);
    Error(res, { msg: "Erreur lors de la récupération des actus par type" });
  }
};

export const publishNews = async (req: Request, res: Response) => {
  const { id, sendEmail } = req.body;

  try {
    await news_service.publishNews(id);

    const news = await news_service.getNewsById(Number(id));
    if(sendEmail){
      // Génération du mail HTML
      const html = template.compileTemplate({title : news.title}, template.templateNotifyNews);

      const recipients = news.target === "Tous"
        ? (await user_service.getUsersAdmin()).map(u => u.email)
        : (await user_service.getUsersbyPermission(news.target)).map(u => u.email);

      if(recipients.length === 0){ 
          Error(res, {msg : "No recipients"});
          
      } 

      const email = {
        from: "integration@utt.fr",
        to: [],
        subject: `[INTEGRATION UTT] Nouvelle actu : ${news.title}`,
        html : html,
        cc: [],
        bcc: recipients,
      };

      await email_service.sendEmail(email);
    }

    Ok(res, { msg: "Actu publiée" });
  } catch (err) {
    console.error(err);
    Error(res, { msg: "Erreur lors de la publication ou de la notification" });
  }
};

export const deleteNews = async (req: Request, res: Response) => {

    const {newsId} = req.query

    try {

      const existing = await news_service.getNewsById(Number(newsId));
      if (existing?.image_url) {
        const imagePath = path.join(__dirname, "../../", existing.image_url);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      await news_service.deleteNews(Number(newsId));
      Ok(res, { msg: "Actus supprimée avec succès !" });
      ;

    } catch (error) {
        Error(res, { msg: "Erreur lors de la suppression de l'actus" });
    }
};


export const updateNews = async (req: Request, res: Response) => {
  const { id, title, description, type, target } = req.body;
  const file = req.file;
  const image_url = file ? `/api/uploads/imgnews/${file.filename}` : undefined;

  try {
    const existing = await news_service.getNewsById(Number(id));
    if (!existing) {
       Error(res, { msg: "Actu introuvable" });
    }

    // Supprimer l'ancienne image si une nouvelle est uploadée
    if (file && existing.image_url) {
      const oldPath = path.join(__dirname, "../../", existing.image_url);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const updates: any = { title, description, type, target };
    if (image_url) updates.image_url = image_url;

    const updated = await news_service.updateNews(Number(id), updates);

    Ok(res, { msg: "Actu mise à jour avec succès", data: updated });
    ;
  } catch (err) {
    console.error(err);
    Error(res, { msg: "Erreur lors de la mise à jour de l'actu" });
  }
};
  