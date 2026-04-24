import { type Request, type Response } from 'express';
import sanitizeHtml from 'sanitize-html';
import { sendEmail } from '../services/email.service';
import * as registration_service from '../services/registration.service';
import * as user_service from '../services/user.service';
import * as template from '../utils/emailtemplates';
import { Error, Ok } from '../utils/responses';

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
export const generateEmailHtml = (templateName: string, data: any) => {
    switch (templateName) {
        case 'templateNotebook':
            return template.compileTemplate({ notebook: data.notebook }, template.templateNotebook);

        case 'templateAttributionBus':
            return template.compileTemplate({ bus: data.bus, time: data.time }, template.templateAttributionBus);

        case 'templateWelcome':
            return template.compileTemplate({ token: data.token }, template.templateWelcome);

        case 'templateNotifyNews':
            return template.compileTemplate(
                { title: data.title, description: data.description },
                template.templateNotifyNews
            );

        case 'templateNotifyTentConfirmation':
            return template.compileTemplate(
                { user1: data.user1, user2: data.user2, confirmed: data.confirmed },
                template.templateNotifyTentConfirmation
            );

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
    const { subject, templateName, permission, sendTo, html } = req.body.payload;

    try {
        // Récupérer les destinataires
        const recipients = await getRecipients(permission, sendTo);



        if (!recipients.length) {
            Error(res, { msg: 'Aucun destinataire trouvé.' });
            return;
        }

        for (const recp of recipients) {
            let htmlEmail = '';

            if (templateName !== 'custom') {

                if (templateName === "templateWelcome") {
                    const user = await user_service.getUserByEmail(recp);
                    const token = await registration_service.getRegistrationByUserId(user.id);
                    if (!token) continue;
                    // Générer le contenu HTML du mail
                    htmlEmail = generateEmailHtml(templateName, { token: token });

                }
                if (templateName === "templateNotebook") {
                    htmlEmail = generateEmailHtml(templateName, { notebook: 'https://drive.google.com/file/d/1Tl8UeILFlAdj9IC2vy3gYXdXCOzD4ugX/view?usp=sharing' });
                }
                if (templateName === "templateAttributionBus") {
                    htmlEmail = generateEmailHtml(templateName, { bus: 'bus', time: '09h00' });
                }
            }

            else {
                htmlEmail = sanitizeHtml(html || '');
            }

            const emailOptions: EmailOptions = {
                from: "integration@utt.fr",
                to: [recp],
                cc: [],
                bcc: [],
                subject,
                text: req.body.payload.text || '',
                html: htmlEmail,
            };

            await sendEmail(emailOptions);
        }


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
