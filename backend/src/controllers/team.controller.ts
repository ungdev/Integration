import { Request, Response } from "express";
import { Error, Ok, Unauthorized } from "../utils/responses";
import * as team_service from "../services/team.service";
import * as faction_service from "../services/faction.service";
import * as event_service from '../services/event.service'
import { Event } from "../schemas/Basic/event.schema";

export const createNewTeam = async (req: Request, res: Response) => {
    const { teamName, members } = req.body;

    try {
        const status: Event = await event_service.getEventsStatus();
        if (!status?.pre_registration_open) {
            Error(res, { msg: "L'enregistrement d'équipe est fermé." });
            return;
        }
        if(members.length < 4){
            Error(res, { msg: "Il n'y a pas assez de membre dans l'équipe." });
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

export const createNewTeamLight = async (req: Request, res: Response) => {
    const { teamName, factionId } = req.body;

    try {
        const newTeamLigth = await team_service.createTeamLight(teamName,factionId);
        Ok(res, {msg: "Equipe créée !"});

    } catch (error) {
        Error(res, { msg: "Erreur lors de la création de l'équipe." });
    }
};

export const getTeams = async (req: Request, res: Response) => {

    try {
        const teams = await team_service.getTeams();
        Ok(res, { data: teams });
        return;

    } catch (error) {
        Error(res, { msg: "Erreur lors de la récupération des équipes." });
    }
};

export const modifyTeam = async (req: Request, res: Response) => {
    try {
        const { teamID, teamName, teamMembers, factionID } = req.body;

        if (!teamID) {
            Error(res, { msg: "teamID est requis pour la mise à jour." });
        }

        const updatedTeam = await team_service.modifyTeam(teamID, teamMembers, factionID, teamName );
        Ok(res, { data: updatedTeam });

    } catch (error) {
        console.error(error);
        Error(res, { msg: "Erreur lors de la modification de l'équipe." });
    }
};

export const getTeamUsers = async (req: Request, res: Response) => {

        const {teamId} = req.query;
    try {
        const teamUsers = await team_service.getTeamUsers(teamId);
        Ok(res,{ data: teamUsers });
        return;
        } catch (error) {
        console.error(error);
        Error(res,{ msg: "Erreur interne lors de la récupération des utilisateurs avec leurs rôles." });
        return;
    
    }

}

export const getTeamFaction = async (req: Request, res: Response) => {

    const {teamId} = req.query;
    try {
        const teamFactionId = await team_service.getTeamUsers(teamId);
        const teamFaction = await faction_service.getFaction(teamFactionId);
        Ok(res,{ data: teamFaction });
        return;
    } catch (error) {
        console.error(error);
        Error(res,{ msg: "Erreur interne lors de la récupération des utilisateurs avec leurs rôles." });
        return;

    }

}

export const deleteTeam = async (req: Request, res: Response) => {
    try {
      const { teamID } = req.query; // Assumes the teamID is passed as a parameter
  
      if (!teamID) {
        Error(res, { msg: "teamID est requis." });
      }
  
        const deletedTeam = await team_service.deleteTeam(Number(teamID));
        Ok(res, { msg: "Équipe supprimée avec succès.", data: deletedTeam });
  
    } catch (error) {
        console.error(error);
        Error(res, { msg: "Erreur lors de la suppression de l'équipe." });
    }
  };
  
