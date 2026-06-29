export interface EmailOptions {
    from: string;
    to: string[];
    subject: string;
    text?: string;
    html: string;
    cc: string[];
    bcc: string[];
}

export type TemplateData = Record<string, unknown>;

export type TemplateRenderer = {
    fileName: string;
    buildData: (data: TemplateData) => TemplateData;
};

export interface EmailOptions {
    from: string;
    to: string[];
    subject: string;
    text?: string;
    html?: string;
    cc?: string[];
    bcc?: string[];
}

export interface PermanenceEmailData extends TemplateData {
    permName: string;
    permBeginDate: string;
    permBeginHour: string;
    permEndDate: string;
    permEndHour: string;
    permLocation: string;
    permDescription: string;
}
