import { Request, Response } from "express";
import * as news_service from "../services/news.service";
import { Ok, Error } from "../utils/responses";
import * as template from "../utils/emailtemplates";
import * as email_service from "../services/email.service";
import * as user_service from '../services/user.service'

export const createNews = async (req: Request, res: Response) => {
  const { title, description, type, published, target } = req.body;

  try {
    const news = await news_service.createNews(title, description, type, published, target);
    Ok(res, { msg: "Actu créée avec succès", data: news });
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
  const { id, title, description, type, target } = req.body;

  try {
    await news_service.publishNewsandNotify(id);

    // Génération du mail HTML
    const html = template.compileTemplate({ title, description }, template.templateNotifyNews);

    const recipients = target === "Tous"
      ? (await user_service.getUsers()).map(u => u.email)
      : (await user_service.getUsersbyPermission(target)).map(u => u.email);

    if(recipients.length === 0){ 
        Error(res, {msg : "No recipients"});
        return
    } 

    const email = {
      from: "integration@utt.fr",
      to: [],
      subject: `[INTEGRATION UTT] Nouvelle actu : ${title}`,
      html : html,
      cc: [],
      bcc: recipients,
    };

    await email_service.sendEmail(email);

    Ok(res, { msg: "Actu publiée et emails envoyés" });
  } catch (err) {
    console.error(err);
    Error(res, { msg: "Erreur lors de la publication ou de la notification" });
  }
};

export const deleteNews = async (req: Request, res: Response) => {

    const {newsId} = req.query

    try {
        await news_service.deleteNews(Number(newsId));
        Ok(res, { msg: "Actus supprimée avec succès !" });
        return;

    } catch (error) {
        Error(res, { msg: "Erreur lors de la suppression de l'actus" });
    }
};


export const updateNews = async (req: Request, res: Response) => {
    const { id, title, description, type, target } = req.body;
  
    try {
      const updated = await news_service.updateNews(Number(id), {
        title,
        description,
        type,
        target,
      });
  
      if (!updated) {
        Error(res, { msg: "Aucune actu trouvée à modifier" });
        return;
      }
  
      Ok(res, { msg: "Actu mise à jour avec succès", data: updated });
    } catch (err) {
      console.error(err);
      Error(res, { msg: "Erreur lors de la mise à jour de l'actu" });
    }
};
  