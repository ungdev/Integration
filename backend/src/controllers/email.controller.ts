import { Request, Response } from 'express';
import { sendEmail } from '../services/email.service';
import * as user_service from '../services/user.service';
import * as registration_service from '../services/registration.service';
import { Error, Ok } from '../utils/responses';
import * as template from '../utils/emailtemplates';

export interface EmailOptions {
  from: string;
  to: string[];
  subject: string;
  text?: string;
  html: string;
  cc: string[];
  bcc: string[];
}

// Fonction pour générer l'HTML à partir du template
const generateEmailHtml = (templateName: string, data: any)  => {
  switch (templateName) {
    case 'templateNotebook':
      return template.compileTemplate({ notebook: data.notebook }, template.templateNotebook);
    case 'templateAttributionBus':
      return template.compileTemplate({ bus:  data.bus, time: data.tim }, template.templateAttributionBus);
    case 'templateWelcome':
      return template.compileTemplate({ token: data.token }, template.templateWelcome);
    default:
      return null;
  }
};

// Fonction utilitaire pour récupérer les destinataires
const getRecipients = async (permission: string | undefined, sendTo: string[] | undefined) => {
  if (permission) {
    const users = await user_service.getUsersbyPermission(permission);
    return users.map((user) => user.email);
  } else {
    return sendTo || [];
  }
};

export const handleSendEmail = async (req: Request, res: Response) => {
  const { subject, templateName, format, permission, sendTo, text } = req.body.payload;

  try {
    // Récupérer les destinataires
    const recipients = await getRecipients(permission, sendTo);

    if (!recipients.length) {
      Error(res, { msg: 'Aucun destinataire trouvé.' });
      return;
    }

    recipients.forEach(async (recp) => {

      let htmlEmail

      if(templateName === "templateWelcome"){

        let token;
        let user = await user_service.getUserByEmail(recp)
        token = await registration_service.getRegistrationByUserId(user.id)
        if(!token) return;
        // Générer le contenu HTML du mail
        htmlEmail = generateEmailHtml(templateName, {token : token});
        
      if(templateName === "templateWelcome"){
        htmlEmail = generateEmailHtml(templateName, {notebook : 'link'});
      }
      if(templateName === "templateNotebook"){
        htmlEmail = generateEmailHtml(templateName, {notebook : 'link'});
      }
      if(templateName === "templateAttributionBus"){
        htmlEmail = generateEmailHtml(templateName, {bus : 'bus', time: '09h00'});
      }
      // Préparer les options d'email
      const emailOptions: EmailOptions = {
        from: "integration@utt.fr",
        to: [recp],
        cc: [],
        bcc: [],
        subject,
        text,
        html: htmlEmail,
      };
      


      // Envoi de l'email
      await sendEmail(emailOptions);
      }
    })
    
    Ok(res, { msg: 'Email envoyé avec succès !' });
    return;
  } catch (err) {
    console.error(err);
    Error(res, { msg: 'Erreur lors de l\'envoi de l\'email.' });
    return;
  }
};

export const handlePreviewEmail = async (req: Request, res: Response) => {
  const { templateName } = req.body;

  try {
    // Générer le contenu HTML pour l'aperçu
    const htmlEmail = generateEmailHtml(templateName, {});

    if (!htmlEmail) {
      Error(res, { msg: "Nom de template invalide" });
      return;
    }

    Ok(res, { data: htmlEmail });
    return;
  } catch (err) {
    console.error(err);
    Error(res, { msg: 'Erreur lors de la génération de la preview.' });
    return;
  }
};
