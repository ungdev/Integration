import api from '../api';

export const getAllBanned = async () => {
    const res = await api.get('/banned/admin/all/');
    return res.data.data;
};

export const addBanned = async (email: string) => {
    const res = await api.post('/banned/admin/', { email });
    return res.data;
};

export const removeBanned = async (id: number) => {
    const res = await api.delete(`/banned/admin/${id}/`);
    return res.data;
};
