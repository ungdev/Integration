// src/services/googleSheets.service.ts
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const path = require('path');
const keyFilePath = path.resolve(__dirname, '../utils/google_creditentials.json');

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
