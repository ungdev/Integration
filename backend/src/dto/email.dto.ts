type EmailPayload = {
    subject: string;
    templateName: string;
    recipientsGroups?: string[];
    sendTo?: string[];
    html?: string;
    title?: string;
    content?: string;
    text?: string;
};

export type EmailRequestBody = {
    payload?: EmailPayload;
} & Partial<EmailPayload>;
