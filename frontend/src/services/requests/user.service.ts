import {
    type CreateUserContactInformationRequest,
    type NewUser,
    type User,
    type UserContactInformation,
    type UserOnboardingStatus,
    type VssQuestionnaireQuestion,
    type VssSubmissionRequest,
    type VssSubmissionResponse,
} from '../../interfaces/user.interface';
import api from '../api';

export const getPermission = (): string | null => {
    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            return decodedToken?.userPermission || null;
        } catch (error) {
            console.error('Erreur lors du décodage du token:', error);
            return null;
        }
    }
    return null;
};

export const isAdmin = (): boolean => {
    return getPermission() === 'Admin';
};

export const isConnected = (): boolean => {
    return getPermission() !== null;
};

export const getUsers = async () => {
    const response = await api.get('/user/user/getusers');
    const users = response.data.data;
    return users;
};

export const getUsersAdmin = async () => {
    const response = await api.get('/user/admin/getusers');
    const users = response.data.data;
    return users;
};

export const getUsersByPermission = async () => {
    const response = await api.get('/user/admin/getusersbypermission');
    const users = response.data.data;
    return users;
};

export const getUserContactInformation = async (userId: number) => {
    const response = await api.get(`/user/admin/getusercontactinformation/${userId}`);
    const users: UserContactInformation = response.data.data;
    return users;
};

export const createUserContactInformation = async (data: CreateUserContactInformationRequest) => {
    const response = await api.post(`/user/user/usercontactinformation`, data);
    return response.data;
};

export const getCurrentUserOnboardingStatus = async () => {
    const response = await api.get('/user/onboarding-status');
    const status: UserOnboardingStatus = response.data.data;
    return status;
};

export const getVssQuestionnaire = async () => {
    const response = await api.get('/user/vss/questionnaire');
    const questionnaire: VssQuestionnaireQuestion[] = response.data.data;
    return questionnaire;
};

export const submitVssQuestionnaire = async (data: VssSubmissionRequest) => {
    const response = await api.post('/user/vss/questionnaire', data);
    const result: VssSubmissionResponse = response.data.data;
    return result;
};

export const getCurrentUser = async () => {
    const res = await api.get('/user/user/me');
    return res.data.data;
};

export const updateCurrentUser = async (data: Partial<User>) => {
    const response = await api.patch('/user/user/me', data);
    return response.data;
};

export const updateUserByAdmin = async (id: number, data: Partial<User>) => {
    const response = await api.patch(`/user/admin/user/${id}`, data);
    return response.data;
};

export const createUserByAdmin = async (data: NewUser) => {
    const response = await api.post(`/user/admin/user`, data);
    return response.data;
};

export const deleteUserByAdmin = async (id: number) => {
    const response = await api.delete(`/user/admin/user/${id}`);
    return response.data;
};

export const syncnewStudent = async (date: string) => {
    const response = await api.post(`/user/admin/syncnewstudent/`, { date });
    return response.data;
};

export const syncDiscordUser = async (code: string) => {
    const response = await api.post(`/discord/user/callback/`, { code });
    return response.data;
};
