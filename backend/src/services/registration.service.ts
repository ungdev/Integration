import { db } from '../prisma/db';

export const getRegistrationByUserId = async (userId: number) => {
    try {
        const token = await db.registration_tokens.findFirst({ where: { user_id: userId } });
        return token ? token.token : null;
    } catch (err) {
        console.error('Erreur lors de la récupération du token d\'enregistrement:', err);
        throw new Error('Erreur de base de données');
    }
};
