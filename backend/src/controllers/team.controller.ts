import { type Event } from '../schemas/Basic/event.schema';
import * as event_service from '../services/event.service';
import * as faction_service from '../services/faction.service';
import * as team_service from '../services/team.service';
import { Error, Ok } from '../shared/http/responses';
import type { AppRequestHandler } from '../types/http';
import type { CreateTeamBody, CreateTeamLightBody, ModifyTeamBody, TeamQuery } from '../dto/team.dto';

export const createNewTeam: AppRequestHandler<CreateTeamBody> = async (req, res) => {
    const { teamName, members } = req.body;

    try {
        if (!teamName) {
            Error(res, { msg: "Il n'y a pas de nom d'équipe" });
            return;
        }
        const status: Event = await event_service.getEventsStatus();
        if (!status?.pre_registration_open) {
            Error(res, { msg: "L'enregistrement d'équipe est fermé." });
            return;
        }
        if (members.length < 4) {
            Error(res, { msg: "Il n'y a pas assez de membre dans l'équipe." });
            return;
        }
        if (members.length > 5) {
            Error(res, { msg: "Il y a trop de membre dans l'équipe." });
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
        Ok(res, { msg: 'Équipe créée avec succès !', data: newTeam });
        return;
    } catch {
        Error(res, { msg: "Erreur lors de la création de l'équipe." });
    }
};

export const createNewTeamLight: AppRequestHandler<CreateTeamLightBody> = async (req, res) => {
    const { teamName, factionId } = req.body;

    try {
        await team_service.createTeamLight(teamName, factionId);
        Ok(res, { msg: 'Equipe créée !' });
    } catch {
        Error(res, { msg: "Erreur lors de la création de l'équipe." });
    }
};

export const getTeams: AppRequestHandler = async (_req, res) => {
    try {
        const teams = await team_service.getTeams();
        Ok(res, { data: teams ?? {} });
        return;
    } catch {
        Error(res, { msg: 'Erreur lors de la récupération des équipes.' });
    }
};

export const getUserTeam: AppRequestHandler = async (req, res) => {
    try {
        const team = await team_service.getUserTeamDisplayInfos(req.user?.userId);
        Ok(res, { data: team });
        return;
    } catch {
        Error(res, { msg: "Erreur lors de la récupération de l'équipe." });
    }
};

export const getTeamsWithfactions: AppRequestHandler = async (_req, res) => {
    try {
        const teams = await team_service.getTeamsAll();
        Ok(res, { data: teams });
        return;
    } catch {
        Error(res, { msg: 'Erreur lors de la récupération des équipes et de leur faction.' });
    }
};

export const modifyTeam: AppRequestHandler<ModifyTeamBody> = async (req, res) => {
    try {
        const { teamID, teamName, teamMembers, factionID, socialLink, type } = req.body;

        if (!teamID) {
            Error(res, { msg: 'teamID est requis pour la mise à jour.' });
        }

        const updatedTeam = await team_service.modifyTeam(teamID, teamMembers, factionID, socialLink, teamName, type);
        Ok(res, { data: updatedTeam });
    } catch (error) {
        console.error(error);
        Error(res, { msg: "Erreur lors de la modification de l'équipe." });
    }
};

export const getTeamUsers: AppRequestHandler<unknown, TeamQuery> = async (req, res) => {
    const { teamId } = req.query;

    try {
        const teamUsers = await team_service.getTeamUsers(teamId);
        Ok(res, { data: teamUsers });
        return;
    } catch (error) {
        console.error(error);
        Error(res, { msg: 'Erreur interne lors de la récupération des utilisateurs avec leurs rôles.' });
        return;
    }
};

export const getAllTeamsWithUsers: AppRequestHandler = async (_req, res) => {
    try {
        const teamUsers = await team_service.getAllTeamsWithUsers();
        Ok(res, { data: teamUsers });
        return;
    } catch (error) {
        console.error(error);
        Error(res, { msg: 'Erreur interne lors de la récupération des utilisateurs avec leurs rôles.' });
        return;
    }
};

export const getTeamFaction: AppRequestHandler<unknown, TeamQuery> = async (req, res) => {
    const { teamId } = req.query;

    try {
        const factionId = await team_service.getTeamFaction(teamId);
        const teamFaction = await faction_service.getFaction(factionId);
        Ok(res, { data: teamFaction });
        return;
    } catch (error) {
        console.error(error);
        Error(res, { msg: 'Erreur interne lors de la récupération des utilisateurs avec leurs rôles.' });
        return;
    }
};

export const deleteTeam: AppRequestHandler<unknown, TeamQuery> = async (req, res) => {
    try {
        const { teamID } = req.query; // Assumes the teamID is passed as a parameter

        if (!teamID) {
            Error(res, { msg: 'teamID est requis.' });
        }

        const deletedTeam = await team_service.deleteTeam(Number(teamID));
        Ok(res, { msg: 'Équipe supprimée avec succès.', data: deletedTeam });
    } catch (error) {
        console.error(error);
        Error(res, { msg: "Erreur lors de la suppression de l'équipe." });
    }
};

export const teamDistribution: AppRequestHandler = async (_req, res) => {
    try {
        team_service.teamDistribution();
        Ok(res, { msg: 'NewStudents distributed!' });
    } catch (error) {
        Error(res, { error });
        return;
    }
};
