import { type ApiMessageResponse, type ShotgunAttemptPayload, type ShotgunAttemptRow, type ShotgunStatusData } from '../../interfaces/event.interface';
import api from '../api';

export const checkShotgunStatus = async (): Promise<ShotgunStatusData> => {
    const response = await api.get<{ data: ShotgunStatusData }>("/event/user/shotgunstatus");
    return response.data.data;
};

export const checkPreRegisterStatus = async () => {
    const response = await api.get("/event/user/preregisterstatus");
    return response.data.data;
};

export const checkSDIStatus = async () => {
    const response = await api.get("/event/user/sdistatus");
    return response.data.data;
};

export const checkWEIStatus = async () => {
    const response = await api.get("/event/user/weistatus");
    return response.data.data;
};

export const checkFoodStatus = async () => {
    const response = await api.get("/event/user/foodstatus");
    return response.data.data;
};

export const checkChallengeStatus = async () => {
    const response = await api.get("/event/user/challstatus");
    return response.data.data;
};

export const attemptShotgun = async (payload: ShotgunAttemptPayload): Promise<ApiMessageResponse> => {
    const response = await api.post<ApiMessageResponse>("event/user/shotgunattempt", payload);
    return response.data;
};

export const getShotgunAttemptsAdmin = async (): Promise<ShotgunAttemptRow[]> => {
    const response = await api.get<{ data: ShotgunAttemptRow[] }>("/event/admin/shotgunattempts");
    return response.data.data;
};

export const toggleShotgun = async (shotgunOpen: boolean) => {
    const response = await api.post(`event/admin/shotguntoggle`, { shotgunOpen });
    return response.data;
};

export const togglePreRegistration = async (preRegistrationOpen: boolean) => {
    const response = await api.post(`event/admin/preregistrationtoggle`, { preRegistrationOpen });
    return response.data;
};

export const toggleSDI = async (sdiOpen: boolean) => {
    const response = await api.post(`event/admin/sditoggle`, { sdiOpen });
    return response.data;
};

export const toggleWEI = async (weiOpen: boolean) => {
    const response = await api.post(`event/admin/weitoggle`, { weiOpen });
    return response.data;
};

export const toggleFood = async (foodOpen: boolean) => {
    const response = await api.post(`event/admin/foodtoggle`, { foodOpen });
    return response.data;
};

export const toggleChallenge = async (challOpen: boolean) => {
    const response = await api.post(`event/admin/challtoggle`, { challOpen });
    return response.data;
};
