import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

const templateCache = new Map<string, string>();

const readTemplate = (templateFileName: string) => {
    const cached = templateCache.get(templateFileName);
    if (cached) return cached;

    const templatePath = path.join(path.resolve(__dirname, './templates'), templateFileName);

    if (fs.existsSync(templatePath)) {
        const content = fs.readFileSync(templatePath, 'utf8');
        templateCache.set(templateFileName, content);
        return content;
    }

    throw new Error(`Template introuvable: ${templateFileName}`);
};

export const compileTemplate = (data: any, fileName: string) => {
    const compiled = Handlebars.compile(readTemplate(fileName));
    return compiled(data);
};
