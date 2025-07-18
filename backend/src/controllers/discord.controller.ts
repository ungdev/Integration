import { Request, Response } from "express";
import { Ok, Error, Unauthorized, Created } from "../utils/responses";
import * as discord_service from "../services/discord.service";

// === ADMIN PANEL ===

export const createChallenge = async (req: Request, res: Response) => {

  const {code} = req.body;
  const userId = req.user?.userId;

    if (!code) {

        Error(res, {msg :"Code manquant dans l'URL"}) 
        return; 
    }

    try {
        const discordUser = await discord_service.syncDiscordUserId(String(code), userId);

        // ✨ Ici tu peux lier le compte Discord à l'utilisateur connecté sur ton site
        // Ex : await userService.linkDiscord(userId, discordUser.id);

        console.log("Utilisateur Discord reçu :", discordUser);

        Ok(res, {msg:`Ton compte Discord (${discordUser.username}#${discordUser.discriminator}) a bien été lié à ton profil UTT.`});
    } catch (err) {
        console.error("Erreur dans handleDiscordCallback:", err);
        Error(res, {msg :"Erreur pendant la liaison avec Discord"});
    }
};