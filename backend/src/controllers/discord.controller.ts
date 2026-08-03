import * as discord_service from '../services/discord.service';
import { Error, Ok, ServiceUnavailable } from '../shared/http/responses';
import type { AppRequestHandler } from '../types/http';
import type { DiscordBody } from '../dto/discord.dto';

export const createChallenge: AppRequestHandler<DiscordBody> = async (req, res) => {
    const { code } = req.body;
    const userId = req.user?.userId;

    return ServiceUnavailable(res, { msg: 'Synchronisation Discord désactivée.' });

    if (!code) {
        Error(res, { msg: "Code manquant dans l'URL" });
        return;
    }

    try {
        const discordUser = await discord_service.syncDiscordUserId(String(code), userId);
        Ok(res, {
            msg: `Ton compte Discord (${discordUser.username}#${discordUser.discriminator}) a bien été lié à ton profil UTT.`,
        });
    } catch (err) {
        console.error('Erreur dans handleDiscordCallback:', err);
        Error(res, { msg: 'Erreur pendant la liaison avec Discord.' });
    }
};
