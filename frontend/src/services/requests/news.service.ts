import { type News } from '../../interfaces/news.interface';
import api from '../api';

type NewsPayload = {
    id?: string;
    title: string;
    description: string;
    type: string;
    published: boolean;
    target: string;
    image_url?: string | null;
};

export const getAllNews = async () => {
    const res = await api.get("/news/admin/all");
    return res.data.data;
};

export const createNews = async (payload: NewsPayload) => {
    const response = await api.post("/news/admin/createnews", payload);
    return response.data;
};

export const publishNews = async (news: Pick<News, 'id'>, sendEmail: boolean) => {
    const res = await api.post("/news/admin/publish", {
        id: news.id,
        sendEmail: sendEmail
    });
    return res.data;
};

export const getAllPublished = async () => {
    const res = await api.get("/news/user/published");
    return res.data;
};

export const deleteNews = async (newsId: number) => {
    const res = await api.delete("news/admin/deletenews", { params: { newsId } });
    return res.data;
};

export const updateNews = async (payload: NewsPayload) => {
    const response = await api.post("/news/admin/updatenews", payload);
    return response.data;
};
