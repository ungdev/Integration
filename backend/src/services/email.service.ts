import nodemailer from 'nodemailer';
import type { EmailOptions, TemplateData } from "../../types/email";
import { templateRenderers } from "../email/email.registry";
import { compileTemplate } from "../email/email.renderer";
import { email_from, email_host, email_password, email_user } from '../utils/secret';

export const generateEmailHtml = (
    templateName: string,
    data: TemplateData
) => {
    const renderer = templateRenderers[templateName];

    if (!renderer) return null;

    return compileTemplate(
        renderer.buildData(data),
        renderer.fileName
    );
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
    try {
        const transporter = nodemailer.createTransport({
            host: email_host,
            port: 587,
            secure: false,
            auth: {
                user: email_user,
                pass: email_password,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: options.from || email_from,
            to: options.to ? options.to.join(', ') : '',
            subject: options.subject,
            text: options.text,
            html: options.html,
            cc: options.cc ? options.cc.join(', ') : undefined,
            bcc: options.bcc ? options.bcc.join(', ') : undefined,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error)
        throw new Error('Erreur lors de l\'envoi de l\'email:');
    }
};
