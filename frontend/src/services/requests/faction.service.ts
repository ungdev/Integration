import api from '../api';

export const getAllFactions = async () => {
  const res = await api.get("faction/factions");

  return res.data.data;
};

export const createFaction = async (factionName : string) => {
  const res = await api.post("faction/createfaction", {factionName});

  return res.data;
};