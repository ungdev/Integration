import axios from 'axios';
import { api_billetweb_token, api_billetweb_url, api_billetweb_respondent_students_list_id } from './secret';
import type { BilletwebUser } from '../../types/billetweb';

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

        const response = await axios.post(
            `${api_billetweb_url}/list/${listId}/remove`,
            {
                data: [[email]],
            },
            { headers },
        );
        return response;
    } catch (error) {
        console.error(`Error removing ${email} from list ${listId}:`, error);
        throw error;
    }
};

export const addUserToRespondentStudentsList = async (user: BilletwebUser) => {
    addUserToList(api_billetweb_respondent_students_list_id, user);
};

export const removeUserFromRespondentStudentsList = async (email: string) => {
    removeUserFromList(api_billetweb_respondent_students_list_id, email);
};
