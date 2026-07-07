import { db } from '../database/db';
import { bannedAddressesSchema } from '../schemas/Basic/banned-addresses';
import { userSchema } from '../schemas/Basic/user.schema';
import { busAttributionSchema } from '../schemas/Relational/busattribution.schema';
import { challengeValidationSchema } from '../schemas/Relational/challengevalidation.schema';
import { registrationSchema } from '../schemas/Relational/registration.schema';
import { respoPermanenceSchema } from '../schemas/Relational/userpermanences.schema';
import { userPermanenceSchema } from '../schemas/Relational/userpermanences.schema';
import { userPreferencesSchema, userRolesSchema } from '../schemas/Relational/userroles.schema';
import { userTeamsSchema } from '../schemas/Relational/userteams.schema';
import { userTentSchema } from '../schemas/Relational/usertent.schema';
import { eq } from 'drizzle-orm';

export const addBanned = async (email: string) => {
    const user = (await db.select().from(userSchema).where(eq(userSchema.email, email)))[0];

    if (user) {
        // TODO: à simplifier une fois que les éléments en db seront en CASCADE
        await db.delete(busAttributionSchema).where(eq(busAttributionSchema.user_id, user.id));
        await db.delete(challengeValidationSchema).where(eq(challengeValidationSchema.target_user_id, user.id));
        await db.delete(registrationSchema).where(eq(registrationSchema.user_id, user.id));
        await db.delete(respoPermanenceSchema).where(eq(respoPermanenceSchema.user_id, user.id));
        await db.delete(userPermanenceSchema).where(eq(userPermanenceSchema.user_id, user.id));
        await db.delete(userPreferencesSchema).where(eq(userPreferencesSchema.userId, user.id));
        await db.delete(userRolesSchema).where(eq(userRolesSchema.user_id, user.id));
        await db.delete(userTeamsSchema).where(eq(userTeamsSchema.user_id, user.id));
        await db.delete(userTentSchema).where(eq(userTentSchema.user_id_1, user.id));
        await db.delete(userTentSchema).where(eq(userTentSchema.user_id_2, user.id));
        await db.delete(userSchema).where(eq(userSchema.id, user.id));
    }

    const result = await db.insert(bannedAddressesSchema).values({ email }).onConflictDoNothing().returning();

    return Array.isArray(result) && result.length > 0 ? result[0] : null;
};

export const removeBanned = async (id: number) => {
    const result = await db.delete(bannedAddressesSchema).where(eq(bannedAddressesSchema.id, id)).returning();

    return Array.isArray(result) && result.length > 0 ? result[0] : null;
};

export const getAllBanned = async () => {
    const result = await db.select().from(bannedAddressesSchema);
    return result;
};

export const getBannedByEmail = async (email: string) => {
    const result = (await db.select().from(bannedAddressesSchema).where(eq(bannedAddressesSchema.email, email)))[0];
    return result;
};
