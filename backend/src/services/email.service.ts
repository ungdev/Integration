import nodemailer from 'nodemailer';
import { email_from, email_host, email_password, email_user } from '../utils/secret';

interface EmailOptions {
    from: string;
    to: string[];
    subject: string;
    text?: string;
    html?: string;
    cc?: string[];
    bcc?: string[];
}

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
