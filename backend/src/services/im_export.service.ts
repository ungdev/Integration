import { google } from 'googleapis';
import * as user_service from './user.service';

import path from 'path';

export interface teamMemberUser {
    prenom: string;
    nom: string;
    ce: boolean;
    equipe: string | null;
}

export interface busUser {
    id: number;
    prenom: string;
    nom: string;
    mail: string;
    telephone: string;
    nouveau: boolean;
    ce: boolean;
    num_equipe: number | null;
    benevole: boolean;
    orga: boolean;
    majeur: boolean;
}

const keyFilePath = path.resolve(__dirname, '../utils/google_credentials.json');

// Crée une instance JWT en utilisant la clé du service account
const jwtClient = new google.auth.JWT({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Fonction pour écrire dans Google Sheets
export const writeToGoogleSheet = async (spreadsheetId: string, range: string, values: any[][]) => {
    try {
        // Crée un client Sheets en utilisant JWT pour l'authentification
        const sheets = google.sheets({ version: 'v4', auth: jwtClient });

        // Appel pour écrire les données dans la feuille
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            requestBody: {
                values,
            },
        });

        console.log(`Données envoyées à Google Sheets dans la plage ${range}`);
    } catch (error) {
        console.error("Erreur lors de l'écriture dans Google Sheets:", error);
        throw error;
    }
};

export const exportBus = async (): Promise<busUser[]> => {
    const users = await user_service.getUsersAll();

    const formattedUsers = users.map((u) => {
        const isOrga = u.roles && u.roles.length > 0;
        const isCE = u.permission === 'Student' && u.teamId !== null;
        const isBenevole = u.roles.some((role) => role.roleName === 'Bénévole');

        return {
            id: u.id,
            prenom: u.first_name ?? '',
            nom: u.last_name ?? '',
            mail: u.email ?? '',
            telephone: u.contact ?? '',
            nouveau: u.permission === 'Nouveau',
            ce: isCE,
            num_equipe: u.teamId ?? null,
            benevole: isBenevole,
            orga: isOrga,
            majeur: u.majeur ?? false,
        };
    });

    return formattedUsers;
};

export const exportTeamMembers = async (): Promise<teamMemberUser[]> => {
    const usersInTeams = (await user_service.getUsersAll()).filter((u) => u.teamId !== null);

    const formattedUsers = usersInTeams.map((u) => {
        const isCE = u.permission === 'Student' && u.teamId !== null;
        return {
            prenom: u.first_name ?? '',
            nom: u.last_name ?? '',
            ce: isCE,
            equipe: u.teamName,
        };
    });

    return formattedUsers;
};
