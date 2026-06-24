import { type Request, type Response } from 'express';
import { sendEmail } from '../services/email.service';
import * as registration_service from '../services/registration.service';
import * as user_service from '../services/user.service';
import * as template from '../utils/emailtemplates';
import { Error, Ok } from '../utils/responses';
import { email_from, service_url } from '../utils/secret';
import { getLatestUploadedDocument } from '../utils/uploadDocuments';

export interface EmailOptions {
    from: string;
    to: string[];
    subject: string;
    text?: string;
    html: string;
    cc: string[];
    bcc: string[];
}

type TemplateData = Record<string, unknown>;

type TemplateRenderer = {
    fileName: string;
    buildData: (data: TemplateData) => TemplateData;
};

const templateRenderers: Record<string, TemplateRenderer> = {
    custom: {
        fileName: 'custom.html',
        buildData: (data) => {
            const typedData = data as { title?: string; content?: string };
            return {
                title: typedData.title ?? '',
                content: typedData.content ?? '',
            };
        },
    },
    templateNotebook: {
        fileName: template.templateNotebook,
        buildData: (data) => {
            const typedData = data as {
                notebook_fr?: string;
                notebook_en?: string;
            };
            return { 
                notebook_fr: typedData.notebook_fr,
                notebook_en: typedData.notebook_en
            };
        },
    },
    templateAttributionBus: {
        fileName: template.templateAttributionBus,
        buildData: (data) => {
            const typedData = data as { bus?: string; time?: string };
            return { bus: typedData.bus, time: typedData.time };
        },
    },
    templateWelcome: {
        fileName: template.templateWelcome,
        buildData: (data) => {
            const typedData = data as { token?: string };
            return { token: typedData.token };
        },
    },
    templateNotifyNews: {
        fileName: template.templateNotifyNews,
        buildData: (data) => {
            const typedData = data as { title?: string };
            return { title: typedData.title };
        },
    },
    templateNotifyTentConfirmation: {
        fileName: template.templateNotifyTentConfirmation,
        buildData: (data) => {
            const typedData = data as { user1?: string; user2?: string; confirmed?: boolean };
            return {
                user1: typedData.user1,
                user2: typedData.user2,
                confirmed: typedData.confirmed,
            };
        },
    },
    templateResetPassword: {
        fileName: template.templateResetPassword,
        buildData: (data) => {
            const typedData = data as { resetLink?: string };
            return { resetLink: typedData.resetLink };
        },
    },
};

// Fonction pour générer l'HTML à partir du template
export const generateEmailHtml = (templateName: string, data: TemplateData) => {
    const renderer = templateRenderers[templateName];
    if (!renderer) {
        return null;
    }

    return template.compileTemplate(renderer.buildData(data), renderer.fileName);
};

const defaultPreviewData: Record<string, TemplateData> = {
    custom: {
        title: 'Titre de démonstration',
        content: 'Premier paragraphe.\nDeuxième ligne conservée.\n\nNouvel alinéa.',
    },
    templateNotebook: {
        notebook_fr: `${service_url}api/uploads/notebooks/fr.pdf`,
        notebook_en: `${service_url}api/uploads/notebooks/en.pdf`
    },
    templateAttributionBus: {
        bus: 'bus',
        time: '09h00',
    },
    templateWelcome: {
        token: 'preview-token',
    },
    templateNotifyNews: {
        title: 'Titre de démonstration',
    },
    templateNotifyTentConfirmation: {
        user1: 'Utilisateur 1',
        user2: 'Utilisateur 2',
        confirmed: true,
    },
    templateResetPassword: {
        resetLink: `${service_url}resetpassword?token=preview-token`,
    },
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
    const { subject, templateName, permission, sendTo, html, title, content } = req.body.payload;

    try {
        // Récupérer les destinataires
        const recipients = await getRecipients(permission, sendTo);

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

                htmlEmail = generateEmailHtml(templateName, { token: registrationToken });
            } else if (templateName === 'templateNotebook') {
                const notebook_fr = await getLatestUploadedDocument('notebooks', 'fr');
                const notebook_en = await getLatestUploadedDocument('notebooks', 'en');

                if (!notebook_fr || !notebook_en) {
                    return Error(res, {
                        msg: 'Cahier de vacances manquant (fr ou en).'
                    });
                }

                htmlEmail = generateEmailHtml(templateName, {
                    notebook_fr: `${service_url}api/uploads/notebooks/fr.pdf`,
                    notebook_en: `${service_url}api/uploads/notebooks/en.pdf`
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
        Error(res, { msg: 'Erreur lors de l\'envoi de l\'email.' });
        return;
    }
};

export const handlePreviewEmail = async (req: Request, res: Response) => {
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
