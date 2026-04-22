import { existsSync, mkdirSync, writeFileSync } from "fs";
import { JWT } from 'google-auth-library';
import { google } from 'googleapis';
import { parse } from "json2csv";
import * as user_service from './user.service';

const path = require('path');
const keyFilePath = path.resolve(__dirname, '../utils/google_credentials.json');

// Crée une instance JWT en utilisant la clé du service account
const jwtClient = new JWT({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Fonction pour écrire dans Google Sheets
export const writeToGoogleSheet = async (
    spreadsheetId: string,
    range: string,
    values: any[][]
) => {
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
        console.error('Erreur lors de l\'écriture dans Google Sheets:', error);
        throw error;
    }
};

export const exportUsersToCSV = async (): Promise<string> => {
    const users = await user_service.getUsersAll();

    const formattedUsers = users.map(u => {
        const isOrga = u.roles && u.roles.length > 0;
        const isCE = u.permission === "Student" && u.teamId !== null;
        const isBenevole = u.roles.some(role => role.roleName === "Bénévole");

        return {
            id: u.id,
            prenom: u.first_name ?? "",
            nom: u.last_name ?? "",
            mail: u.email ?? "",
            telephone: u.contact ?? "",
            nouveau: u.permission === "Nouveau",
            ce: isCE,
            num_equipe: u.teamId ?? null,
            benevole: isBenevole,
            orga: isOrga,
            majeur: u.majeur ?? false,
        };
    });

    const csv = parse(formattedUsers, {
        fields: [
            "id", "prenom", "nom", "mail", "telephone",
            "nouveau", "ce", "num_equipe", "benevole", "orga", "majeur", "bus_manual"
        ]
    });

    const exportDir = path.join(__dirname, "../../exports/bus");
    const filePath = path.join(exportDir, "bus.csv");

    if (!existsSync(exportDir)) {
        mkdirSync(exportDir, { recursive: true });
    }

    writeFileSync(filePath, csv);

    return filePath;

};
