import api from "../api";

export const sendEmail = async (payload: any) => {
    const response = await api.post('/email/admin/sendemail', { payload });
    return response.data;
};

export const emailPreview = async (templateName: any) => {
    const response = await api.post('email/admin/previewemail', { templateName })
    return response.data.data
}
