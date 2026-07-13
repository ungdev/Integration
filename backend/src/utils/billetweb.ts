import axios from 'axios';
import { api_billetweb_token, api_billetweb_url, api_billetweb_respondent_students_list_id } from './secret';
import type { BilletwebUser, BilletwebMember } from '../../types/billetweb';

const headers = {
    accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: api_billetweb_token,
};

const addUserToList = async (listId: string, user: BilletwebUser) => {
    try {
        if (!api_billetweb_url || !api_billetweb_token || !api_billetweb_respondent_students_list_id) return;

        await axios.post(
            `${api_billetweb_url}/list/${listId}/push`,
            {
                data: [[user.email, user.firstName, user.lastName]],
            },
            { headers },
        );
    } catch (error) {
        console.error(`Error adding user ${user.email} to list ${listId}:`, error);
        throw error;
    }
};

const removeUserFromList = async (listId: string, email: string) => {
    try {
        if (!api_billetweb_url || !api_billetweb_token || !api_billetweb_respondent_students_list_id) return;

        const { data } = await axios.get<BilletwebMember[]>(`${api_billetweb_url}/list/${listId}/data`, { headers });

        const members = data.filter(([memberEmail]) => memberEmail !== email);

        // Ne rien faire si l'utilisateur n'était pas dans la liste
        if (members.length === data.length) {
            return;
        }

        await axios.post(`${api_billetweb_url}/list/${listId}/replace`, { data: members }, { headers });
    } catch (error) {
        console.error('Error removing user from list:', error);
        throw error;
    }
};

export const addUserToRespondentStudentsList = async (user: BilletwebUser) => {
    addUserToList(api_billetweb_respondent_students_list_id, user);
};

export const removeUserFromRespondentStudentsList = async (email: string) => {
    removeUserFromList(api_billetweb_respondent_students_list_id, email);
};
