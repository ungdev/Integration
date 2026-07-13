import type { EmailOptions } from '../../types/email';
import { defaultPreviewData } from '../email/email.preview-data';
import { generateEmailHtml, getRecipients, sendEmail } from '../services/email.service';
import * as registration_service from '../services/registration.service';
import * as user_service from '../services/user.service';
import { Error, Ok } from '../utils/responses';
import { email_from, service_url } from '../utils/secret';
import { getLatestUploadedDocument } from '../utils/uploadDocuments';
import type { AppRequestHandler } from '../types/http';
import type { EmailRequestBody } from '../dto/email.dto';

export const handleSendEmail: AppRequestHandler<EmailRequestBody> = async (req, res) => {
    const { subject, templateName, recipientsGroups, sendTo, html, title, content } = req.body.payload!;

    try {
        // Récupérer les destinataires
        const recipients = await getRecipients(recipientsGroups, sendTo);

        if (!recipients.length) {
            Error(res, { msg: 'Aucun destinataire trouvé.' });
            return;
        }

        for (const recp of recipients) {
            let htmlEmail = '';

            if (templateName === 'custom') {
                htmlEmail = generateEmailHtml('custom', {
                    title: title || subject,
                    content: content || html || '',
                });
            } else if (templateName === 'templateWelcome') {
                const user = await user_service.getUserByEmail(recp);
                if (!user) {
                    continue;
                }

                const registrationToken = await registration_service.getRegistrationByUserId(user.id);
                if (!registrationToken) {
                    continue;
                }

                htmlEmail = generateEmailHtml(templateName, {
                    token: registrationToken,
                });
            } else if (templateName === 'templateNotebook') {
                const notebook_fr = await getLatestUploadedDocument('notebooks', 'fr');
                const notebook_en = await getLatestUploadedDocument('notebooks', 'en');

                if (!notebook_fr || !notebook_en) {
                    return Error(res, {
                        msg: 'Cahier de vacances manquant (fr ou en).',
                    });
                }

                htmlEmail = generateEmailHtml(templateName, {
                    notebook_fr: `${service_url}api/uploads/notebooks/fr.pdf`,
                    notebook_en: `${service_url}api/uploads/notebooks/en.pdf`,
                });
            } else {
                htmlEmail = generateEmailHtml(templateName, defaultPreviewData[templateName] || {});
            }

            if (!htmlEmail) {
                Error(res, { msg: 'Template HTML introuvable ou invalide.' });
                return;
            }

            const emailOptions: EmailOptions = {
                from: email_from,
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
        Error(res, { msg: "Erreur lors de l'envoi de l'email." });
        return;
    }
};

export const handlePreviewEmail: AppRequestHandler<EmailRequestBody> = async (req, res) => {
    const { templateName, title, content, ...rest } = req.body.payload ?? req.body;

    try {
        // Générer le contenu HTML pour l'aperçu
        const htmlEmail = generateEmailHtml(templateName, {
            ...(defaultPreviewData[templateName] || {}),
            ...rest,
            title,
            content,
        });

        if (!htmlEmail) {
            Error(res, { msg: 'Nom de template invalide' });
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
