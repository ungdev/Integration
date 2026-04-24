import { type Request, type Response } from "express";
import * as discord_service from "../services/discord.service";
import { Error, Ok } from "../utils/responses";

export const createChallenge = async (req: Request, res: Response) => {
    const { code } = req.body;
    const userId = req.user?.userId;

    if (!code) {
        Error(res, { msg: "Code manquant dans l'URL" })
        return;
    }

    try {
        const discordUser = await discord_service.syncDiscordUserId(String(code), userId);
        Ok(res, { msg: `Ton compte Discord (${discordUser.username}#${discordUser.discriminator}) a bien été lié à ton profil UTT.` });
    } catch (err) {
        console.error("Erreur dans handleDiscordCallback:", err);
        Error(res, { msg: "Erreur pendant la liaison avec Discord" });
    }
};
