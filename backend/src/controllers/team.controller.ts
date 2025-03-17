import { Request, Response } from "express";
import { Error, Ok, Unauthorized } from "../utils/responses";
import * as team_service from "../services/team.service";
import * as event_service from '../services/event.service'
import { Event } from "../schemas/Basic/event.schema";

export const createNewTeam = async (req: Request, res: Response) => {
    const { teamName, members } = req.body;

    try {
        const status: Event = await event_service.getEventsStatus();
        if (!status?.pre_registration_open) {
            Unauthorized(res, { msg: "L'enregistrement d'équipe est fermé." });
            return;
        }

        // Check if any member already belongs to a team
        for (const userId of members) {
            const existingTeam = await team_service.getUserTeam(userId);
            if (existingTeam) {
                Error(res, { msg: "Quelqu'un de la sélection a déjà une équipe." });
                return;
            }
        }

        // Create the new team if no one is already in a team
        const newTeam = await team_service.createTeam(teamName, members);
        Ok(res, { msg: "Équipe créée avec succès !", data: newTeam });
        return;

    } catch (error) {
        Error(res, { msg: "Erreur lors de la création de l'équipe." });
    }
};