import api from '../api';

export const getAllFactionsAdmin = async () => {
    const res = await api.get("faction/admin/factions");
    return res.data.data;
};

export const getAllFactionsUser = async () => {
    const res = await api.get("faction/user/factions");
    return res.data.data;
};

export const createFaction = async (factionName: string) => {
    const res = await api.post("faction/admin/createfaction", { factionName });
    return res.data;
};

export const deleteFaction = async (factionId: number) => {
    const res = await api.delete("faction/admin/deletefaction", { params: { factionId } });
    return res.data;
};
