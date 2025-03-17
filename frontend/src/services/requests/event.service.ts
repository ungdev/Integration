import api from '../api';

export const checkShotgunStatus = async () => {

    try{
        const response = await api.get("/event/shotgunstatus");
        return response.data.data;
    }catch(error){
        throw new Error("Error while fecthing Shotgun Statut" + error);
    }
  };


export const checkPreRegisterStatus = async () => {

    try{
        const response = await api.get("/event/preregisterstatus");
        return response.data.data;
    }catch(error){
        throw new Error("Error while fecthing Pre-Registration Statut" + error);
    }
};

export const attemptShotgun = async () => {

    try{
        const response = await api.post("event/shotgunattempt");
        return response.data;
    }
    catch(error){
        throw new Error("Error while attempting shotgun" + error);
    }
};

export const toggleShotgun = async (shotgunOpen: boolean) => {

    try{
        const response = await api.post(`event/shotguntoggle`, { shotgunOpen });
        return response.data;
    }
    catch(error){
        throw new Error("Error while toggle Shotgun" + error);
    }
    
};

  export const togglePreRegistration = async (preRegistrationOpen: boolean) => {

    try{
        const response = await api.post(`event/preregistrationtoggle`, { preRegistrationOpen});
        return response.data;
    }
    catch(error){
        throw new Error("Error while toggle Pre-Resgitration" + error);
    }
    
};