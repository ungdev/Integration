import api from "../api";

export const createTeam = async (teamName: string, members: number[]) => {

        const response = await api.post(`team/create`, { teamName, members });
        console.log(response.data);
        return response.data;
  };