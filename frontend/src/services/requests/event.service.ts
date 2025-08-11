import api from '../api';

export const checkShotgunStatus = async () => {

        const response = await api.get("/event/user/shotgunstatus");
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

export const attemptShotgun = async () => {

    const response = await api.post("event/user/shotgunattempt");
    return response.data;

};

export const toggleShotgun = async (shotgunOpen: boolean) => {

        const response = await api.post(`event/admin/shotguntoggle`, { shotgunOpen });
        return response.data;
    
};

export const togglePreRegistration = async (preRegistrationOpen: boolean) => {

        const response = await api.post(`event/admin/preregistrationtoggle`, { preRegistrationOpen});
        return response.data;

    
};

export const toggleSDI = async (sdiOpen: boolean) => {

        const response = await api.post(`event/admin/sditoggle`, { sdiOpen});
        return response.data;

    
};

export const toggleWEI = async (weiOpen: boolean) => {

        const response = await api.post(`event/admin/weitoggle`, { weiOpen});
        return response.data;

    
};