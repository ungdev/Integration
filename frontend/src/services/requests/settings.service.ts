import {
    type ApiMessageResponse,
    type Setting,
    type ShotgunAttemptPayload,
    type ShotgunAttemptRow,
    type ShotgunStatusData,
} from '../../interfaces/settings.interface';
import api from '../api';

export const checkShotgunStatus = async (): Promise<ShotgunStatusData> => {
    const response = await api.get<{ data: ShotgunStatusData }>('/settings/user/status/shotgun');
    return response.data.data;
};

const getSetting = async (key: string): Promise<Setting> => {
    const response = await api.get<{ data: Array<Setting & { password?: string }> }>('/settings/user/status');
    const setting = response.data.data.find((item) => item.key === key);
    if (!setting) throw new Error(`Le setting ${key} n'est pas disponible.`);
    return setting;
};

export const getSettings = async (): Promise<Setting[]> => {
    const response = await api.get<{ data: Setting[] }>('/settings/user/status');
    return response.data.data;
};

export const getAdminSettings = async (): Promise<Setting[]> => {
    const response = await api.get<{ data: Setting[] }>('/settings/admin/settings');
    return response.data.data;
};

export const updateSetting = async (key: string, open: boolean) => {
    const response = await api.patch(`/settings/admin/status/${key}`, { open });
    return response.data;
};

export const checkPreRegisterStatus = async () => (await getSetting('preRegistration')).open;

export const checkSDIStatus = async () => (await getSetting('sdi')).open;

export const checkWEIStatus = async () => (await getSetting('wei')).open;

export const checkFoodStatus = async () => (await getSetting('food')).open;

export const checkChallengeStatus = async () => (await getSetting('challenge')).open;

export const attemptShotgun = async (payload: ShotgunAttemptPayload): Promise<ApiMessageResponse> => {
    const response = await api.post<ApiMessageResponse>('settings/user/shotgunattempt', payload);
    return response.data;
};

export const getShotgunAttemptsAdmin = async (): Promise<ShotgunAttemptRow[]> => {
    const response = await api.get<{ data: ShotgunAttemptRow[] }>('/settings/admin/shotgunattempts');
    return response.data.data;
};
