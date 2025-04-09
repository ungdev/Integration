import { Request, Response } from "express";
import { Accepted, Error, Ok, Unauthorized } from "../utils/responses";
import * as event_service from "../services/event.service";
import * as team_service from "../services/team.service";
import { Event } from "../schemas/Basic/event.schema";


export const checkShotgunStatus = async (req: Request, res: Response) => {
    try{
        const status = await event_service.getEventsStatus();
        Ok(res, ({data: status?.shotgun_open }));

    }catch(error){
        Error(res, {msg :"Error while catching shotgun status :" + error})
    }
};

export const checkPreRegisterStatus = async (req: Request, res: Response) => {
    try{
        const status = await event_service.getEventsStatus();
        Ok(res, ({data: status?.pre_registration_open}));

    }catch(error){
        Error(res, {msg :"Error while catching shotgun status :" + error})
    }
};


export const shotgunAttempt = async (req: Request, res: Response) => {

    const userId = req.user.userId;
  
    const status = await event_service.getEventsStatus();
    if (!status?.shotgun_open) {
      Unauthorized(res, { msg: "Le shotgun est fermé." });
      return;
    }
    try{
        const userTeam = await team_service.getUserTeam(userId)

        const alreadyShotgun = await event_service.alreadyShotgun(userTeam)

        if(alreadyShotgun){
            Accepted(res, { msg: "Votre équipe est déjà dans le shotgun." });
            return;
        }

        await event_service.validateShotgun(userTeam);
        Ok(res, { msg: "Shotgun validé !"});
        return;
    }catch(error){
        Error(res, {msg :"Error while shotguning : "+ error});
        return;
    }
};

export const togglePreRegistration = async (req: Request, res: Response) => {
    const { preRegistrationOpen } = req.body;
  
    try {
      const result = await event_service.updatepreRegistrationStatus(preRegistrationOpen);
      Ok(res, { msg: "Paramètres mis à jour.", data : result});
    } catch (error) {
      Error(res, { msg: "Erreur lors de la mise à jour." });
    }
};

export const toggleShotgun = async (req: Request, res: Response) => {
    const { shotgunOpen } = req.body;
  
    try {
      const result = await event_service.updateShotgunStatus(shotgunOpen);
      Ok(res,{ msg: "Paramètres mis à jour.", data: result });
    } catch (error) {
      Error(res,{ msg: "Erreur lors de la mise à jour." });
    }
};