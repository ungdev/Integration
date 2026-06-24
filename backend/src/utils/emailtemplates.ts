import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

const templateDirectories = [
    path.resolve(__dirname, '../templates/email'),
    path.resolve(process.cwd(), 'src/templates/email'),
    path.resolve(process.cwd(), 'backend/src/templates/email'),
];

const templateCache = new Map<string, string>();

const readTemplate = (templateFileName: string) => {
    const cachedTemplate = templateCache.get(templateFileName);
    if (cachedTemplate) {
        return cachedTemplate;
    }

    for (const directory of templateDirectories) {
        const templatePath = path.join(directory, templateFileName);
        if (fs.existsSync(templatePath)) {
            const templateContent = fs.readFileSync(templatePath, 'utf8');
            templateCache.set(templateFileName, templateContent);
            return templateContent;
        }
    }

    throw new Error(`Template HTML introuvable: ${templateFileName}`);
};

export const templateResetPassword = 'reset-password.html';
export const templateNotebook = 'notebook.html';
export const templateAttributionBus = 'attribution-bus.html';
export const templateWelcome = 'welcome.html';
export const templateNotifyNews = 'notify-news.html';
export const templateNotifyTentConfirmation = 'notify-tent-confirmation.html';

export const compileTemplate = (data: any, templateFileName: string) => {
    const compiledTemplate = Handlebars.compile(readTemplate(templateFileName));
    return compiledTemplate(data);
};
