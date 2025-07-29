import api from '../api';

export const getAllNews = async () => {
  const res = await api.get("/news/admin/all");

  return res.data.data;
};

export const createNews = async (formData: FormData) => {

  const response = await api.post("/news/admin/createnews", formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data)
  return response.data;
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

export const updateNews = async (formData: FormData) => {
  const response = await api.post("/news/admin/updatenews", formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  return response.data;
};
  


