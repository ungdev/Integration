import api from '../api';

export const getAllFactions = async () => {
  const res = await api.get("faction/factions");

  return res.data.data;
};