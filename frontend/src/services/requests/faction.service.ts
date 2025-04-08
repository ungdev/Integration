import api from '../api';

export const getAllFactions = async () => {
  const res = await api.get("faction/factions");

  return res.data.data;
};

export const createFaction = async (factionName : string) => {
  const res = await api.post("faction/createfaction", {factionName});

  return res.data;
};

export const deleteFaction = async (factionId : number) => {
  const res = await api.delete("faction/deletefaction", {params : {factionId}});

  return res.data;
};