import api from '../api';

export const getAllNews = async () => {
  const res = await api.get("/news/admin/all");

  return res.data.data;
};

export const createNews = async (formData : any) => {
    const res = await api.post("/news/admin/createnews", formData);
  
    return res.data;
};

export const publishNews = async (news : any) => {
    const res = await api.post("/news/admin/publish", {
        id: news.id,
        title: news.title,
        description: news.description,
        type: news.type,
        target: news.target,
      });
  
    return res.data;
};

export const getAllPublished = async () => {
    const res = await api.get("/news/user/published");
  
    return res.data;
};

export const deleteNews = async (newsId : number) => {
  const res = await api.delete("news/admin/deletenews", {params : {newsId}});

  return res.data;
};

export const updateNews = async (data: {
    id: number;
    title: string;
    description: string;
    type: string;
    target: string;
  }) => {
    const res = await api.put("/news/admin/updatenews", data);
    return res.data;
  };
  


