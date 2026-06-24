import api from "../api";

type SendEmailPayload = {
    subject: string;
    templateName: string;
    format?: 'html' | 'txt';
    permission: string | null;
    sendTo: string[] | null;
    title?: string;
    content?: string;
    html?: string;
};

type PreviewEmailPayload = {
    templateName: string;
    title?: string;
    content?: string;
};

export const sendEmail = async (payload: SendEmailPayload) => {
    const response = await api.post('/email/admin/sendemail', { payload });
    return response.data;
};

export const emailPreview = async (payload: PreviewEmailPayload) => {
    const response = await api.post('/email/admin/previewemail', { payload });
    return response.data.data
}
