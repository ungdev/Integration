import api from '../api';

export const checkShotgunStatus = async () => {

    try{
        const response = await api.get("/event/user/shotgunstatus");
        return response.data.data;
    }catch(error){
        throw new Error("Error while fecthing Shotgun Statut" + error);
    }
  };


export const checkPreRegisterStatus = async () => {

    try{
        const response = await api.get("/event/user/preregisterstatus");
        return response.data.data;
    }catch(error){
        throw new Error("Error while fecthing Pre-Registration Statut" + error);
    }
};

export const attemptShotgun = async () => {

    const response = await api.post("event/user/shotgunattempt");
    return response.data;

};

export const toggleShotgun = async (shotgunOpen: boolean) => {

    try{
        const response = await api.post(`event/admin/shotguntoggle`, { shotgunOpen });
        return response.data;
    }
    catch(error){
        throw new Error("Error while toggle Shotgun" + error);
    }
    
};

  export const togglePreRegistration = async (preRegistrationOpen: boolean) => {

    try{
        const response = await api.post(`event/admin/preregistrationtoggle`, { preRegistrationOpen});
        return response.data;
    }
    catch(error){
        throw new Error("Error while toggle Pre-Resgitration" + error);
    }
    
};