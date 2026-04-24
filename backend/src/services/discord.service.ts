import axios from 'axios';
import { eq } from 'drizzle-orm';
import { db } from '../database/db'; // Import de la connexion PostgreSQL
import { userSchema } from '../schemas/Basic/user.schema';
import { discord_client_id, discord_client_secret, discord_redirect_uri } from '../utils/secret';

export const syncDiscordUserId = async (code: string, userId: number) => {
    // Étape 1 : échange le code contre un access token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
        client_id: discord_client_id,
        client_secret: discord_client_secret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: discord_redirect_uri,
        scope: 'identify'
    }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    const access_token = tokenResponse.data.access_token;

    // Étape 2 : récupère les infos utilisateur avec le token
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });

    //Etape 3 : Update le discord_id de l'user
    await db.update(userSchema)
        .set({ discord_id: userResponse.data.id, })
        .where(eq(userSchema.id, userId));

    return userResponse.data; // { id, username, discriminator, ... }
};
