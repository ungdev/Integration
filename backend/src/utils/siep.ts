import { api_utt_admis_url_ismajor, api_utt_auth_url, api_utt_password, api_utt_username } from "./secret";
import axios from 'axios';

export const getTokenUTTAPI = async() => {
    try {
        const response = await axios.post(api_utt_auth_url, {
          login: api_utt_username,
          password: api_utt_password,
        }, {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        return response.data.token;
      } catch (error) {
        console.error('Error during POST request:', error);
      }
}

export const getNewStudentsFromUTTAPI = async (token: string) => {
  const allNewStudents: any[] = [];
  let currentPage = 1;
  let hasNextPage = true;

  try {
    while (hasNextPage) {
      const response = await axios.get(`${api_utt_admis_url_ismajor}?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      const students = data['hydra:member'];
      const nextPage = data['hydra:view']?.['hydra:next'];

      allNewStudents.push(...students);

      if (nextPage) {
        currentPage++;
      } else {
        hasNextPage = false;
      }
    }

    return allNewStudents;
  } catch (error) {
    console.error('Error during GET request:', error);
    return [];
  }
};