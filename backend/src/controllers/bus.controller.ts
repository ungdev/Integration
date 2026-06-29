import { type Request, type Response } from "express";
import * as bus_service from "../services/bus.service";
import { generateEmailHtml, sendEmail } from "../services/email.service";
import { Error, Ok } from "../utils/responses";
import { email_from } from "../utils/secret";

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

export const sendBusAttributionEmails = async (req: Request, res: Response) => {
    try {
        const attributions = await bus_service.getAllBusAttributions();

        if (!attributions.length) {
            Error(res, { msg: "Aucune attribution de bus trouvée." });
            return;
        }

        for (const attr of attributions) {
            const htmlEmail = generateEmailHtml("templateAttributionBus", {
                bus: attr.bus, time: attr.departure_time
            });

            const emailOptions = {
                from: email_from,
                to: [attr.email],
                cc: [],
                bcc: [],
                subject: `Attribution Bus - ${attr.firstName ?? ""} ${attr.lastName ?? ""}`,
                text: `Votre bus attribué est le numéro ${attr.bus}`,
                html: htmlEmail || "",
            };

            await sendEmail(emailOptions);
        }

        Ok(res, { msg: "Emails d'attribution bus envoyés avec succès !" });
    } catch (err) {
        console.error(err);
        Error(res, { msg: "Erreur lors de l'envoi des emails d'attribution bus." });
    }
};

export const uploadbusCSV = async (req: MulterRequest, res: Response) => {
    try {
        const file = req.file;
        if (!file) {
            Error(res, { msg: "Fichier CSV manquant." });
        }

        await bus_service.importBusFromCSV(file.path);
        Ok(res, { msg: "Importation réalisée avec succès." });
    } catch (error) {
        console.error("Erreur import CSV :", error);
        Error(res, { msg: "Échec de l'importation." });
    }
};
