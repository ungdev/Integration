import { db } from '../database/db';  // Import de la connexion PostgreSQL
import { eq } from 'drizzle-orm';
import { registrationSchema } from '../schemas/Relational/registration.schema';


export const getRegistrationByUserId = async (userId: number) => {
    try {
      const token = await db.select().from(registrationSchema).where(eq(registrationSchema.user_id, userId));
      return token[0] ? token[0].token : null; 
    } catch (err) {
      console.error('Erreur lors de la récupération du token d\'enregistrement:', err);
      throw new Error('Erreur de base de données');
    }
};