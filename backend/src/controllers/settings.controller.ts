import * as settings_service from '../services/settings.service';
import * as team_service from '../services/team.service';
import { Conflict, Error, Ok, Teapot, Unauthorized } from '../shared/http/responses';
import { shotgun_password } from '../shared/secrets/secrets';
import type { AppRequestHandler } from '../types/http';
import type { ShotgunBody, ToggleStatusBody } from '../dto/event.dto';

export const getSettingStatus: AppRequestHandler = async (req, res) => {
    const { setting } = req.params;

    if (!setting || !settings_service.isSetting(setting)) {
        Error(res, { msg: 'Setting événement inconnu.' });
        return;
    }

    try {
        const status = await settings_service.getSettingStatus(setting);
        if (setting === 'shotgun') {
            Ok(res, { data: { status, password: status ? shotgun_password : '' } });
        } else {
            Ok(res, { data: status });
        }
    } catch (error) {
        Error(res, { msg: 'Erreur lors de la récupération du statut :' + error });
    }
};

export const getAvailableSettings: AppRequestHandler = async (req, res) => {
    try {
        const userPermission = req.user?.userPermission ?? '';
        const userRoles = req.user?.userRoles?.map((role) => role.roleName) ?? [];
        const settings = await settings_service.getAvailableSettings(userPermission, userRoles);
        Ok(res, { data: settings });
    } catch (error) {
        Error(res, { msg: 'Erreur lors de la récupération des settings :' + error });
    }
};

export const getAdminSettings: AppRequestHandler = async (_req, res) => {
    try {
        const settings = await settings_service.getAllSettings();
        Ok(res, { data: settings });
    } catch (error) {
        Error(res, { msg: 'Erreur lors de la récupération des settings :' + error });
    }
};

export const getShotgunAttempts: AppRequestHandler = async (_req, res) => {
    try {
        const shotgunAttempts = await settings_service.getAllTeamShotguns();
        const shotgunAttemptsWithLeaders = await Promise.all(
            shotgunAttempts.map(async (attempt) => {
                if (!attempt.teamId) {
                    return { ...attempt, leaderCount: 0 };
                }

                const teamUsers = await team_service.getTeamUsers(attempt.teamId);
                const leaderCount = teamUsers.filter((user) => user.permission !== 'Nouveau').length;

                return { ...attempt, leaderCount };
            }),
        );

        Ok(res, { data: shotgunAttemptsWithLeaders });
    } catch (error) {
        Error(res, { msg: 'Erreur lors de la récupération des tentatives shotgun : ' + error });
    }
};

export const shotgunAttempt: AppRequestHandler<ShotgunBody> = async (req, res) => {
    const { password } = req.body;

    const userId = req.user?.userId;

    if (!userId) {
        Unauthorized(res, { msg: 'Utilisateur non authentifié.' });
        return;
    }

    if (!shotgun_password) {
        Error(res, { msg: 'Mot de passe shotgun non configuré côté serveur.' });
        return;
    }

    if (password !== shotgun_password) {
        Teapot(res, { msg: 'Le mot de passe shotgun est incorrect.' });
        return;
    }

    const status = await settings_service.getSettingsStatus();
    if (!status?.shotgun_open) {
        Unauthorized(res, { msg: 'Le shotgun est fermé.' });
        return;
    }
    try {
        const userTeam = await team_service.getUserTeam(userId);

        if (!userTeam) {
            Error(res, { msg: "Erreur : Tu n'as pas d'équipe !" });
            return;
        }

        const alreadyShotgun = await settings_service.alreadyShotgun(userTeam);

        if (alreadyShotgun) {
            Conflict(res, { msg: 'Votre équipe est déjà dans le shotgun.' });
            return;
        }

        await settings_service.validateShotgun(userTeam);
        Ok(res, { msg: 'Shotgun validé !' });
        return;
    } catch (error) {
        Error(res, { msg: 'Erreur pendant le shotguns : ' + error });
        return;
    }
};

export const updateSettingStatus: AppRequestHandler<ToggleStatusBody> = async (req, res) => {
    const { setting } = req.params;
    const { open } = req.body;

    if (!setting || !settings_service.isSetting(setting)) {
        Error(res, { msg: 'Setting événement inconnu.' });
        return;
    }

    if (typeof open !== 'boolean') {
        Error(res, { msg: "Le champ 'open' doit être un booléen." });
        return;
    }

    try {
        const result = await settings_service.updateSettingStatus(setting, open);
        Ok(res, { msg: 'Paramètres mis à jour.', data: result });
    } catch (error) {
        Error(res, { msg: 'Erreur lors de la mise à jour : ' + error });
    }
};
