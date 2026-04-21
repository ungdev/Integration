import { Request, Response } from "express";
import { Accepted, Error, Ok, Teapot, Unauthorized } from "../utils/responses";
import * as event_service from "../services/event.service";
import * as team_service from "../services/team.service";
import { Event } from "../schemas/Basic/event.schema";
import { shotgun_password } from "../utils/secret";

type AuthenticatedRequest = Request & { user?: { userId?: number } };


export const checkShotgunStatus = async (req: Request, res: Response) => {
    try {
        const status = await event_service.getEventsStatus();

        Ok(res, ({ data: { status: Boolean(status?.shotgun_open), password: Boolean(status?.shotgun_open) ? shotgun_password : "" } }));

    } catch (error) {
        Error(res, { msg: "Error while catching shotgun status :" + error })
    }
};

export const checkPreRegisterStatus = async (req: Request, res: Response) => {
    try {
        const status = await event_service.getEventsStatus();
        Ok(res, ({ data: status?.pre_registration_open }));

    } catch (error) {
        Error(res, { msg: "Error while catching pre-registration status :" + error })
    }
};

export const checkSDIStatus = async (req: Request, res: Response) => {
    try {
        const status = await event_service.getEventsStatus();
        Ok(res, ({ data: status?.sdi_open }));

    } catch (error) {
        Error(res, { msg: "Error while catching SDI status :" + error })
    }
};

export const checkWEIStatus = async (req: Request, res: Response) => {
    try {
        const status = await event_service.getEventsStatus();
        Ok(res, ({ data: status?.wei_open }));

    } catch (error) {
        Error(res, { msg: "Error while catching WEI status :" + error })
    }
};

export const checkFoodStatus = async (req: Request, res: Response) => {
    try {
        const status = await event_service.getEventsStatus();
        Ok(res, ({ data: status?.food_open }));

    } catch (error) {
        Error(res, { msg: "Error while catching Food status :" + error })
    }
};

export const checkChallStatus = async (req: Request, res: Response) => {
    try {
        const status = await event_service.getEventsStatus();
        Ok(res, ({ data: status?.chall_open }));

    } catch (error) {
        Error(res, { msg: "Error while catching Challenge status :" + error })
    }
};

export const getShotgunAttempts = async (req: Request, res: Response) => {
    try {
        const shotgunAttempts = await event_service.getAllTeamShotguns();
        const shotgunAttemptsWithLeaders = await Promise.all(
            shotgunAttempts.map(async (attempt) => {
                if (!attempt.teamId) {
                    return { ...attempt, leaderCount: 0 };
                }

                const teamUsers = await team_service.getTeamUsers(attempt.teamId);
                const leaderCount = teamUsers.filter((user) => user.permission !== "Nouveau").length;

                return { ...attempt, leaderCount };
            })
        );

        Ok(res, { data: shotgunAttemptsWithLeaders });
    } catch (error) {
        Error(res, { msg: "Erreur lors de la récupération des tentatives shotgun : " + error });
    }
};


export const shotgunAttempt = async (req: Request, res: Response) => {

    const { password } = req.body as { password?: string };

    const userId = (req as AuthenticatedRequest).user?.userId;

    if (!userId) {
        Unauthorized(res, { msg: "Utilisateur non authentifié." });
        return;
    }

    if (!shotgun_password) {
        Error(res, { msg: "Mot de passe shotgun non configuré côté serveur." });
        return;
    }

    if (password !== shotgun_password) {
        Teapot(res, { msg: "Le mot de passe shotgun est incorrect." });
        return;
    }

    const status = await event_service.getEventsStatus();
    if (!status?.shotgun_open) {
        Unauthorized(res, { msg: "Le shotgun est fermé." });
        return;
    }
    try {
        const userTeam = await team_service.getUserTeam(userId)

        if (!userTeam) {
            Error(res, { msg: "Erreur : Tu n'as pas d'équipe !" });
            return;
        }

        const alreadyShotgun = await event_service.alreadyShotgun(userTeam)

        if (alreadyShotgun) {
            Accepted(res, { msg: "Votre équipe est déjà dans le shotgun." });
            return;
        }

        await event_service.validateShotgun(userTeam);
        Ok(res, { msg: "Shotgun validé !" });
        return;
    } catch (error) {
        Error(res, { msg: "Erreur pendant le shotguns : " + error });
        return;
    }
};

export const togglePreRegistration = async (req: Request, res: Response) => {
    const { preRegistrationOpen } = req.body;

    try {
        const result = await event_service.updatepreRegistrationStatus(preRegistrationOpen);
        Ok(res, { msg: "Paramètres mis à jour.", data: result });
    } catch (error) {
        Error(res, { msg: "Erreur lors de la mise à jour." });
    }
};

export const toggleShotgun = async (req: Request, res: Response) => {
    const { shotgunOpen } = req.body;

    try {
        const result = await event_service.updateShotgunStatus(shotgunOpen);
        Ok(res, { msg: "Paramètres mis à jour.", data: result });
    } catch (error) {
        Error(res, { msg: "Erreur lors de la mise à jour." });
    }
};

export const toggleSDI = async (req: Request, res: Response) => {
    const { sdiOpen } = req.body;

    try {
        const result = await event_service.updateSDIStatus(sdiOpen);
        Ok(res, { msg: "Paramètres mis à jour.", data: result });
    } catch (error) {
        Error(res, { msg: "Erreur lors de la mise à jour." });
    }
};

export const toggleWEI = async (req: Request, res: Response) => {
    const { weiOpen } = req.body;

    try {
        const result = await event_service.updateWEIStatus(weiOpen);
        Ok(res, { msg: "Paramètres mis à jour.", data: result });
    } catch (error) {
        Error(res, { msg: "Erreur lors de la mise à jour." });
    }
};

export const toggleFood = async (req: Request, res: Response) => {
    const { foodOpen } = req.body;

    try {
        const result = await event_service.updateFoodStatus(foodOpen);
        Ok(res, { msg: "Paramètres mis à jour.", data: result });
    } catch (error) {
        Error(res, { msg: "Erreur lors de la mise à jour." });
    }
};

export const toggleChall = async (req: Request, res: Response) => {
    const { challOpen } = req.body;

    try {
        const result = await event_service.updateChallStatus(challOpen);
        Ok(res, { msg: "Paramètres mis à jour.", data: result });
    } catch (error) {
        Error(res, { msg: "Erreur lors de la mise à jour." });
    }
};