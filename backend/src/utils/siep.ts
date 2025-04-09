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

export const getNewStudentsFromUTTAPI = async(token: string) => {
    try {
      const response = await axios.get(api_utt_admis_url_ismajor, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data["hydra:member"];
    } catch (error) {
      console.error('Error during GET request:', error);
    }
  }