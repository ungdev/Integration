import nodemailer from 'nodemailer';
import { zimbra_user, zimbra_password, zimbra_host } from '../utils/secret';

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
      host: zimbra_host,
      port: 587,
      secure: false,
      auth: {
        user: zimbra_user,
        pass: zimbra_password, 
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: options.from,
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
