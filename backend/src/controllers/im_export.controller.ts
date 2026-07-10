import fs from 'fs';
import path from 'path';
import * as event_service from '../services/event.service';
import * as export_service from '../services/im_export.service';
import * as permanence_service from '../services/permanence.service';
import * as team_service from '../services/team.service';
import * as user_service from '../services/user.service';
import { Error, Ok } from '../utils/responses';
import { spreadsheet_id } from '../utils/secret';
import {
    getLatestUploadedDocument,
    isSafeUploadSegment,
    removeUploadedDocuments,
    toUploadedDocumentStatus,
} from '../utils/uploadDocuments';
import type { AppRequestHandler } from '../types/http';
import type { UploadedDocumentParams } from '../dto/im_export.dto';

export const exportAllDataToSheets: AppRequestHandler = async (_req, res) => {
    try {
        // 1. Récupération depuis la DB
        const userList = await user_service.getUsersAll();
        const teamList = await team_service.getTeamsAll();
        const permanenceList = await permanence_service.getAllPermanencesWithUsers();
        const shotgunList = await event_service.getAllTeamShotguns();

        // 2. Mapping -> format pour Google Sheets (array de array)
        const usersValues = [
            [
                'ID',
                'Prénom',
                'Nom',
                'Email',
                'Branche',
                'Permission',
                'Majeur',
                'Contact',
                'Discord',
                'Team',
                'Faction',
            ],
            ...userList.map((u) => [
                u.id ?? 0,
                u.first_name ?? 'No first name',
                u.last_name ?? 'No last name',
                u.email ?? 'No email',
                u.branch ?? 'No branch',
                u.permission ?? 'No permissions',
                u.majeur ?? 'Pas de données',
                u.contact ?? 'No contact',
                u.discord_id ?? 'No discord ID',
                u.teamName ?? 'No Team',
                u.factionName ?? 'No faction',
            ]),
        ];

        const teamsValues = [
            ['ID', 'Nom', 'Type', 'Faction'],
            ...teamList.map((t) => [
                t.id,
                t.name ?? 'No name',
                t.type ?? 'No type',
                t.teamFaction?.name ?? 'No faction',
            ]),
        ];

        const permanenceValues = [
            [
                'ID',
                'Nom',
                'Début',
                'Fin',
                'Lieu',
                'Responsables',
                'Inscrits (noms)',
                'Inscrits (emails)',
                'Présents',
                'Absents',
            ],
            ...permanenceList.map((p) => {
                const respoNames = p.respo ? p.respo.firstName + ' ' + p.respo.lastName : 'Aucun';
                const userNames = p.users?.map((u) => `${u.first_name} ${u.last_name}`)?.join(' ; ') || 'Aucun inscrit';
                const userEmails = p.users?.map((u) => u.email)?.join(' ; ') || 'Aucun inscrit';

                const claimedUsers =
                    p.users
                        ?.filter((u) => u.claimed)
                        ?.map((u) => `${u.first_name} ${u.last_name}`)
                        ?.join(' ; ') || 'Aucun';
                const unclaimedUsers =
                    p.users
                        ?.filter((u) => !u.claimed)
                        ?.map((u) => `${u.first_name} ${u.last_name}`)
                        ?.join(' ; ') || 'Aucun';

                return [
                    p.id,
                    p.name ?? 'Sans nom',
                    p.start_at ? new Date(p.start_at).toLocaleString('fr-FR') : 'N/A',
                    p.end_at ? new Date(p.end_at).toLocaleString('fr-FR') : 'N/A',
                    p.location ?? 'Sans lieu',
                    respoNames,
                    userNames,
                    userEmails,
                    claimedUsers,
                    unclaimedUsers,
                ];
            }),
        ];

        const shotgunValues = [
            ['ID', "Nom de l'équipe", 'Type', 'Horodatage'],
            ...shotgunList.map((s) => [
                s.id,
                s.teamName ?? 'No name',
                s.teamType ?? 'No type',
                s.timestamp?.toISOString() ?? 'No timestamp',
            ]),
        ];
        // 3. Envoi vers les feuilles
        await export_service.writeToGoogleSheet(spreadsheet_id, 'USER!A1', usersValues);
        await export_service.writeToGoogleSheet(spreadsheet_id, 'TEAM!A1', teamsValues);
        await export_service.writeToGoogleSheet(spreadsheet_id, 'PERMANENCES!A1', permanenceValues);
        await export_service.writeToGoogleSheet(spreadsheet_id, 'SHOTGUN!A1', shotgunValues);

        Ok(res, { msg: 'Export réalisé avec succès !' });
    } catch (error) {
        console.error(error);
        Error(res, { msg: "Erreur lors de l'export vers Google Sheets" });
    }
};

export const updateFoodMenu: AppRequestHandler = async (req, res) => {
    const file = req.file;

    try {
        // Supprimer l'ancien Menu si un nouveau est uploadé
        if (file) {
            const targetDir = path.join(__dirname, '../../foodmenu');

            if (fs.existsSync(targetDir)) {
                fs.rmSync(targetDir, { recursive: true, force: true });
                fs.mkdirSync(targetDir);
            }
        }

        Ok(res, { msg: 'Menu mis à jour avec succès' });
        return;
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de la mise à jour du Menu' });
    }
};

export const updatePlannings: AppRequestHandler = async (_req, res) => {
    try {
        Ok(res, { msg: 'Planning mis à jour avec succès' });
        return;
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de la mise à jour du Planning' });
    }
};

export const exportUsersCSV: AppRequestHandler = async (_req, res) => {
    try {
        await export_service.exportUsersToCSV();
        Ok(res, { msg: 'CSV des bus généré' });
    } catch (error) {
        console.error(error);
        Error(res, { msg: "Erreur lors de l'export CSV" });
    }
};

export const getUploadedDocumentStatus: AppRequestHandler<unknown, unknown, UploadedDocumentParams> = async (
    req,
    res,
) => {
    const { category, item } = req.params;

    if (!isSafeUploadSegment(category) || !isSafeUploadSegment(item)) {
        Error(res, { msg: 'Paramètres invalides' });
        return;
    }

    try {
        const latestDocument = await getLatestUploadedDocument(category, item);

        Ok(res, {
            data: toUploadedDocumentStatus(category, latestDocument),
        });
    } catch (err: unknown) {
        if ((err as NodeJS.ErrnoException)?.code === 'ENOENT') {
            Ok(res, {
                data: toUploadedDocumentStatus(category, null),
            });
            return;
        }

        console.error(err);
        Error(res, { msg: 'Erreur lors de la vérification du document' });
    }
};

export const deleteDocument: AppRequestHandler<unknown, unknown, UploadedDocumentParams> = async (req, res) => {
    const { category, item } = req.params;

    if (!isSafeUploadSegment(category) || !isSafeUploadSegment(item)) {
        Error(res, { msg: 'Paramètres invalides' });
        return;
    }

    try {
        const deletedCount = await removeUploadedDocuments(category, item);

        if (deletedCount === 0) {
            return Ok(res, { msg: 'Aucun document à supprimer' });
        }

        Ok(res, {});
    } catch (err: unknown) {
        if ((err as NodeJS.ErrnoException)?.code === 'ENOENT') {
            Ok(res, {});
            return;
        }

        Error(res, { msg: 'Erreur lors de la vérification du document' });
    }
};
