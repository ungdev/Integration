import { and, eq, inArray, sql } from 'drizzle-orm';
import fs from 'fs';
import Papa from 'papaparse';
import type { ConcurrentPermanencesEmailData, PermanenceEmailData } from '../types/email';
import type {
    ConcurrentPermanenceNotification,
    CsvPermanence,
    LightUser,
    Notification,
    Permanence,
} from '../types/permanence';
import { db } from '../database/db';
import {
    AlreadyRegisteredError,
    PermanenceClosedError,
    PermanenceFullError,
    PermanenceNotFoundError,
    RegisterDeadlineError,
    UnauthorizedError,
    UnregisterDeadlineError,
} from '../errors/permanence.error';
import { permanenceSchema } from '../schemas/Basic/permanence.schema';
import { userSchema } from '../schemas/Basic/user.schema';
import { respoPermanenceSchema, userPermanenceSchema } from '../schemas/Relational/userpermanences.schema';
import { email_from } from '../shared/secrets/secrets';
import { generateEmailHtml, sendEmail } from './email.service';

export const getPermanenceById = async (permId: number) => {
    const permanence = await db.query.permanenceSchema.findFirst({
        where: eq(permanenceSchema.id, permId),
    });
    if (!permanence) throw new PermanenceNotFoundError('Permanence introuvable');
    return permanence;
};

// ➕ S'inscrire à une permanence
export const registerUserToPermanence = async (userId: number, permId: number) => {
    try {
        // Vérifications légères (sans verrouillage)
        const user = await db.query.userSchema.findFirst({
            where: eq(userSchema.id, userId),
        });
        if (!user || (user.permission !== 'Student' && user.permission !== 'Admin')) {
            throw new UnauthorizedError('Unauthorized');
        }

        const permanence = await getPermanenceById(permId);

        if (!permanence.is_open) throw new PermanenceClosedError('Permanence not open');

        const limitDate = new Date(String(permanence.start_at).replace(/Z$/, ''));
        const now = new Date();

        if (now > limitDate) {
            throw new RegisterDeadlineError('Too late to register');
        }

        if (permanence.capacity == 0) {
            throw new PermanenceFullError('Permanence full');
        }

        // Transaction avec verrouillage de table complet
        await db.transaction(async (tx) => {
            // 1. VERROUILLAGE COMPLET de la table permanences
            await tx.execute(sql`LOCK TABLE permanences IN EXCLUSIVE MODE`);

            // 2. UPDATE atomique avec condition - décrémente seulement si capacity > 0
            const updateResult = await tx
                .update(permanenceSchema)
                .set({ capacity: sql`capacity - 1` })
                .where(and(eq(permanenceSchema.id, permId), sql`capacity > 0`))
                .returning({ newCapacity: permanenceSchema.capacity });

            // 3. Si aucune ligne modifiée = pas de place disponible
            if (updateResult.length === 0) {
                throw new PermanenceFullError('Permanence full');
            }

            // 4. Insérer l'utilisateur (seulement si l'UPDATE a réussi)
            await tx.insert(userPermanenceSchema).values({
                user_id: userId,
                permanence_id: permId,
            });
        });
    } catch (error: any) {
        // Gestion des erreurs de contraintes de base de données
        if (
            error.code === '23505' || // Contrainte unique PostgreSQL
            error.code === '23000' || // Contrainte d'intégrité générale
            error.message?.includes('UNIQUE constraint') ||
            error.message?.includes('duplicate key') ||
            error.message?.includes('PRIMARY KEY constraint')
        ) {
            throw new AlreadyRegisteredError('Already registered');
        }
        // Re-lancer les autres erreurs
        throw error;
    }
};

// ❌ Se désinscrire d'une permanence
export const unregisterUserFromPermanence = async (userId: number, permId: number) => {
    const permanence = await getPermanenceById(permId);
    const now = new Date();
    const limitDate = new Date(permanence.start_at);
    limitDate.setDate(limitDate.getDate() - 1);

    if (now > limitDate) throw new UnregisterDeadlineError('Too late to unregister');

    // Désinscrire l'utilisateur
    await db
        .delete(userPermanenceSchema)
        .where(and(eq(userPermanenceSchema.user_id, userId), eq(userPermanenceSchema.permanence_id, permId)));

    await modifyPermCap(permId, 1);
};

// 🔎 Voir toutes les permanences ouvertes
export const listOpenPermanences = async () => {
    return await db.query.permanenceSchema.findMany({
        where: eq(permanenceSchema.is_open, true),
        orderBy: permanenceSchema.start_at,
    });
};

// ➕ Créer une permanence
export const createPermanence = async (
    name: string,
    description: string,
    location: string,
    start_at: Date,
    end_at: Date,
    capacity: number,
    difficulty: number,
    respoId: number,
) => {
    // Étape 1 : Création de la permanence
    const [newPermanence] = await db
        .insert(permanenceSchema)
        .values({
            name,
            description,
            location,
            start_at,
            end_at,
            capacity,
            is_open: false,
            difficulty,
        })
        .returning({ id: permanenceSchema.id });

    // Étape 2 : Ajout du responsable
    if (newPermanence?.id && respoId) {
        await db.insert(respoPermanenceSchema).values({
            user_id: respoId,
            permanence_id: newPermanence.id,
        });
    }
};

export const deletePermanence = async (permId: number) => {
    // Étape 1 : Supprimer les inscriptions des utilisateurs
    await db.delete(userPermanenceSchema).where(eq(userPermanenceSchema.permanence_id, permId));

    // Étape 2 : Supprimer les responsables associés
    await db.delete(respoPermanenceSchema).where(eq(respoPermanenceSchema.permanence_id, permId));

    // Étape 3 : Supprimer la permanence
    await db.delete(permanenceSchema).where(eq(permanenceSchema.id, permId));
};

export const updatePermanence = async (
    permId: number,
    name: string,
    description: string,
    location: string,
    start_at: Date,
    end_at: Date,
    capacity: number,
    difficulty: number,
    respoId: number,
) => {
    // Étape 1 : Mise à jour de la permanence
    await db
        .update(permanenceSchema)
        .set({
            name,
            description,
            location,
            start_at,
            end_at,
            capacity,
            is_open: false,
            difficulty,
        })
        .where(eq(permanenceSchema.id, permId));

    // Étape 2 : Suppression des anciens responsables (si nécessaire)
    await db.delete(respoPermanenceSchema).where(eq(respoPermanenceSchema.permanence_id, permId));

    // Étape 3 : Ajout du nouveau responsable
    if (respoId) {
        await db.insert(respoPermanenceSchema).values({
            user_id: respoId,
            permanence_id: permId,
        });
    }
};

// Ouvrir une permanence (Admin action)
export const openPermanence = async (permId: number) => {
    await db.update(permanenceSchema).set({ is_open: true }).where(eq(permanenceSchema.id, permId));
};

// Fermer une permanence (Admin action)
export const closePermanence = async (permId: number) => {
    await db.update(permanenceSchema).set({ is_open: false }).where(eq(permanenceSchema.id, permId));
};

// Modifier la capacité de la permanence
export const modifyPermCap = async (permId: number, factor: number) => {
    const perm = await getPermanenceById(permId);
    const newPermCap = Number(perm.capacity) + factor;

    if (newPermCap < 0) throw new Error('Invalid capacity');

    await db.update(permanenceSchema).set({ capacity: newPermCap }).where(eq(permanenceSchema.id, permId));
};

// Voir ses permanences
export const getMyPermanences = async (userId: number) => {
    const userPerms = await db
        .select({
            id: permanenceSchema.id,
            name: permanenceSchema.name,
            start_at: permanenceSchema.start_at,
            end_at: permanenceSchema.end_at,
            location: permanenceSchema.location,
        })
        .from(userPermanenceSchema)
        .innerJoin(permanenceSchema, eq(permanenceSchema.id, userPermanenceSchema.permanence_id))
        .where(eq(userPermanenceSchema.user_id, userId));

    // Ajout du responsables
    const results = await Promise.all(
        userPerms.map(async (perm) => {
            const [respo] = await db
                .select({
                    id: userSchema.id,
                    firstName: userSchema.first_name,
                    lastName: userSchema.last_name,
                    email: userSchema.email,
                })
                .from(respoPermanenceSchema)
                .innerJoin(userSchema, eq(userSchema.id, respoPermanenceSchema.user_id))
                .where(eq(respoPermanenceSchema.permanence_id, perm.id));

            return {
                ...perm,
                respo: respo ?? null,
            };
        }),
    );

    return results;
};

export const getAllPermanences = async () => {
    const perms = await db.select().from(permanenceSchema);

    const results = await Promise.all(
        perms.map(async (perm) => {
            const [respo] = await db
                .select({
                    userId: userSchema.id,
                    firstName: userSchema.first_name,
                    lastName: userSchema.last_name,
                    email: userSchema.email,
                })
                .from(respoPermanenceSchema)
                .innerJoin(userSchema, eq(userSchema.id, respoPermanenceSchema.user_id))
                .where(eq(respoPermanenceSchema.permanence_id, perm.id));

            return {
                ...perm,
                respo: respo ?? null,
            };
        }),
    );

    return results;
};

export const getUsersInPermanence = async (permId: number) => {
    return await db
        .select({
            userId: userSchema.id,
            firstName: userSchema.first_name,
            lastName: userSchema.last_name,
            claimed: userPermanenceSchema.claimed,
        })
        .from(userPermanenceSchema)
        .innerJoin(userSchema, eq(userSchema.id, userPermanenceSchema.user_id))
        .where(eq(userPermanenceSchema.permanence_id, permId));
};

export const addUserToPermanence = async (userId: number, permId: number) => {
    // Désinscrire l'utilisateur
    await db.insert(userPermanenceSchema).values({
        user_id: userId,
        permanence_id: permId,
    });

    await modifyPermCap(permId, -1);
};

export const removeUserToPermanence = async (userId: number, permId: number) => {
    await db
        .delete(userPermanenceSchema)
        .where(and(eq(userPermanenceSchema.user_id, userId), eq(userPermanenceSchema.permanence_id, permId)));

    await modifyPermCap(permId, 1);
};

export const getAllPermanencesWithUsers = async () => {
    // Récupère toutes les permanences
    const permanences = await getAllPermanences();

    // Pour chaque permanence, on récupère les users associés avec leur statut claimed
    const results = await Promise.all(
        permanences.map(async (permanence) => {
            const userRelations = await db
                .select({
                    id: userSchema.id,
                    first_name: userSchema.first_name,
                    last_name: userSchema.last_name,
                    email: userSchema.email,
                    claimed: userPermanenceSchema.claimed,
                })
                .from(userPermanenceSchema)
                .innerJoin(userSchema, eq(userSchema.id, userPermanenceSchema.user_id))
                .where(eq(userPermanenceSchema.permanence_id, permanence.id));

            return {
                ...permanence,
                users: userRelations,
            };
        }),
    );

    return results;
};

export const importPermanencesFromCSV = async (filePath: string): Promise<void> => {
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const { data, errors } = Papa.parse<CsvPermanence>(fileContent, {
        header: true,
        skipEmptyLines: true,
    });

    if (errors.length > 0) {
        console.error('CSV parsing errors:', errors);
        throw new Error('Erreur lors du parsing du CSV.');
    }

    const parsedData = data.map((r) => ({
        name: r.name,
        description: r.description,
        location: r.location,
        start_at: new Date(r.start_at),
        end_at: new Date(r.end_at),
        capacity: parseInt(r.capacity, 10),
        difficulty: parseInt(r.difficulty, 10),
        is_open: false,
    }));

    await db.insert(permanenceSchema).values(parsedData);
};

export const isUserRespoOfPermanence = async (userId: number): Promise<boolean> => {
    const respo = await db.select().from(respoPermanenceSchema).where(eq(respoPermanenceSchema.user_id, userId));

    return respo.length > 0;
};

export const getPermanenceDetailsForRespo = async (respoId: number) => {
    // Étape 1 : Trouver les permanences dont il est respo
    const respos = await db.select().from(respoPermanenceSchema).where(eq(respoPermanenceSchema.user_id, respoId));

    const permanenceIds = respos.map((r) => r.permanence_id);
    if (permanenceIds.length === 0) throw new Error('Pas de permanences');

    // Étape 2 : Récupérer les permanences
    const permanences = await db.select().from(permanenceSchema).where(inArray(permanenceSchema.id, permanenceIds));

    // Étape 3 : Récupérer les membres avec infos utiles
    const results = await Promise.all(
        permanences.map(async (perm) => {
            const members = await db
                .select({
                    id: userSchema.id,
                    first_name: userSchema.first_name,
                    last_name: userSchema.last_name,
                    email: userSchema.email,
                    claimed: userPermanenceSchema.claimed,
                })
                .from(userPermanenceSchema)
                .innerJoin(userSchema, eq(userSchema.id, userPermanenceSchema.user_id))
                .where(eq(userPermanenceSchema.permanence_id, perm.id));

            return {
                permanence: perm,
                members,
            };
        }),
    );

    return results;
};

export const claimMember = async (userId: number, permId: number, claimed: boolean) => {
    await db
        .update(userPermanenceSchema)
        .set({ claimed })
        .where(and(eq(userPermanenceSchema.user_id, userId), eq(userPermanenceSchema.permanence_id, permId)));
};

export const getDailyNotifications = async (): Promise<Notification[]> => {
    const permanences = await db.query.permanenceSchema.findMany({
        where: sql`
            ${permanenceSchema.start_at} >= CURRENT_DATE + INTERVAL '1 day'
            AND ${permanenceSchema.start_at} < CURRENT_DATE + INTERVAL '2 day'
        `,
        orderBy: permanenceSchema.start_at,
    });

    return getMembersFromPermanences(permanences);
};

export const getHourlyNotifications = async (): Promise<Notification[]> => {
    const permanences = await db.query.permanenceSchema.findMany({
        where: sql`
            ${permanenceSchema.start_at} >= now() + interval '1 hour'
            AND ${permanenceSchema.start_at} < now() + interval '1 hour 5 minutes'
        `,
        orderBy: permanenceSchema.start_at,
    });

    return getMembersFromPermanences(permanences);
};

const findConcurrentItems = <T>(
    items: T[],
    getStartAt: (item: T) => Date | null,
    getEndAt: (item: T) => Date | null,
): T[] => {
    const concurrentItems = new Set<T>();

    for (let firstIndex = 0; firstIndex < items.length; firstIndex += 1) {
        const first = items[firstIndex];
        const firstStartAt = getStartAt(first);
        const firstEndAt = getEndAt(first);
        if (!firstStartAt || !firstEndAt) continue;

        for (let secondIndex = firstIndex + 1; secondIndex < items.length; secondIndex += 1) {
            const second = items[secondIndex];
            const secondStartAt = getStartAt(second);
            const secondEndAt = getEndAt(second);
            if (!secondStartAt || !secondEndAt) continue;

            if (firstStartAt < secondEndAt && secondStartAt < firstEndAt) {
                concurrentItems.add(first);
                concurrentItems.add(second);
            }
        }
    }

    return items.filter((item) => concurrentItems.has(item));
};

export const getConcurrentPermanenceNotifications = async (): Promise<ConcurrentPermanenceNotification[]> => {
    const registrations = await db
        .select({
            userId: userSchema.id,
            email: userSchema.email,
            permanence: permanenceSchema,
        })
        .from(userPermanenceSchema)
        .innerJoin(userSchema, eq(userSchema.id, userPermanenceSchema.user_id))
        .innerJoin(permanenceSchema, eq(permanenceSchema.id, userPermanenceSchema.permanence_id));

    const registrationsByUser = new Map<number, { email: string; permanences: Permanence[] }>();
    for (const registration of registrations) {
        if (!registration.email) continue;
        const userRegistration = registrationsByUser.get(registration.userId) ?? {
            email: registration.email,
            permanences: [],
        };
        userRegistration.permanences.push(registration.permanence);
        registrationsByUser.set(registration.userId, userRegistration);
    }

    return [...registrationsByUser.entries()].flatMap(([userId, userRegistration]) => {
        const { email, permanences } = userRegistration;
        const concurrentPermanences = findConcurrentItems(
            permanences,
            (permanence) => permanence.start_at,
            (permanence) => permanence.end_at,
        );
        return concurrentPermanences.length > 0 ? [{ userId, email, permanences: concurrentPermanences }] : [];
    });
};

export const getConcurrentPermanencesStatus = async (userId: number) => {
    const permanences = await db
        .select({
            id: permanenceSchema.id,
            name: permanenceSchema.name,
            description: permanenceSchema.description,
            location: permanenceSchema.location,
            start_at: permanenceSchema.start_at,
            end_at: permanenceSchema.end_at,
            capacity: permanenceSchema.capacity,
            is_open: permanenceSchema.is_open,
            difficulty: permanenceSchema.difficulty,
        })
        .from(userPermanenceSchema)
        .innerJoin(permanenceSchema, eq(permanenceSchema.id, userPermanenceSchema.permanence_id))
        .where(eq(userPermanenceSchema.user_id, userId));

    const concurrentPermanences = findConcurrentItems(
        permanences,
        (permanence) => permanence.start_at,
        (permanence) => permanence.end_at,
    );

    return {
        concurrentPermanences: concurrentPermanences.length > 0,
        permanences: concurrentPermanences,
    };
};

export const purgeConcurrentPermanences = async () => {
    return db.transaction(async (tx) => {
        await tx.execute(sql`LOCK TABLE user_permanences IN EXCLUSIVE MODE`);

        const registrations = await tx
            .select({
                userId: userPermanenceSchema.user_id,
                permanenceId: permanenceSchema.id,
                startAt: permanenceSchema.start_at,
                endAt: permanenceSchema.end_at,
                difficulty: permanenceSchema.difficulty,
            })
            .from(userPermanenceSchema)
            .innerJoin(permanenceSchema, eq(permanenceSchema.id, userPermanenceSchema.permanence_id));

        const registrationsByUser = new Map<number, typeof registrations>();
        for (const registration of registrations) {
            if (registration.userId === null) continue;

            const userRegistrations = registrationsByUser.get(registration.userId) ?? [];
            userRegistrations.push(registration);
            registrationsByUser.set(registration.userId, userRegistrations);
        }

        let removedRegistrations = 0;
        let affectedUsers = 0;

        for (const [userId, userRegistrations] of registrationsByUser) {
            let removedForUser = false;

            while (true) {
                const conflictingRegistrations = findConcurrentItems(
                    userRegistrations,
                    (registration) => registration.startAt,
                    (registration) => registration.endAt,
                );

                if (conflictingRegistrations.length === 0) break;

                const lowestDifficulty = Math.min(
                    ...conflictingRegistrations.map((registration) => registration.difficulty ?? 0),
                );
                const lowestDifficultyRegistrations = conflictingRegistrations.filter(
                    (registration) => (registration.difficulty ?? 0) === lowestDifficulty,
                );
                const permanenceToRemove =
                    lowestDifficultyRegistrations[Math.floor(Math.random() * lowestDifficultyRegistrations.length)];

                await tx
                    .delete(userPermanenceSchema)
                    .where(
                        and(
                            eq(userPermanenceSchema.user_id, userId),
                            eq(userPermanenceSchema.permanence_id, permanenceToRemove.permanenceId),
                        ),
                    );
                await tx
                    .update(permanenceSchema)
                    .set({ capacity: sql`capacity + 1` })
                    .where(eq(permanenceSchema.id, permanenceToRemove.permanenceId));

                const registrationIndex = userRegistrations.indexOf(permanenceToRemove);
                userRegistrations.splice(registrationIndex, 1);
                removedRegistrations += 1;
                removedForUser = true;
            }

            if (removedForUser) affectedUsers += 1;
        }

        return { removedRegistrations, affectedUsers };
    });
};

// Cette fonction est vouée à disparaitre lors du passage à Prisma, avec un simple "with"
export const getMembersFromPermanences = async (
    permanences: Permanence[],
): Promise<
    {
        permanence: Permanence;
        members: LightUser[];
    }[]
> => {
    return await Promise.all(
        permanences.map(async (perm) => {
            const members = await db
                .select({
                    id: userSchema.id,
                    firstName: userSchema.first_name,
                    lastName: userSchema.last_name,
                    email: userSchema.email,
                })
                .from(userPermanenceSchema)
                .innerJoin(userSchema, eq(userSchema.id, userPermanenceSchema.user_id))
                .where(eq(userPermanenceSchema.permanence_id, perm.id));

            return {
                permanence: perm,
                members: members,
            };
        }),
    );
};

export const sendNotifications = async (notifications: Notification[]) => {
    for (const notification of notifications) {
        const permanenceEmailData: PermanenceEmailData = {
            permName: notification.permanence.name,
            permBeginDate: new Intl.DateTimeFormat('fr-FR', {
                day: '2-digit',
                month: 'long',
            }).format(new Date(notification.permanence.start_at.getTime() + 2 * 3600000)),
            permBeginHour: new Intl.DateTimeFormat('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
            }).format(new Date(notification.permanence.start_at.getTime() + 2 * 3600000)),
            permEndDate: new Intl.DateTimeFormat('fr-FR', {
                day: '2-digit',
                month: 'long',
            }).format(new Date(notification.permanence.end_at.getTime() + 2 * 3600000)),
            permEndHour: new Intl.DateTimeFormat('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
            }).format(new Date(notification.permanence.end_at.getTime() + 2 * 3600000)),
            permLocation: notification.permanence.location,
            permDescription: notification.permanence.description,
        };
        const subject = `[RAPPEL] Permanence - ${notification.permanence.name}`;

        const htmlEmail = generateEmailHtml('templateNotifyPermanenceReminder', permanenceEmailData);

        for (const member of notification.members) {
            try {
                const emailOptions = {
                    from: email_from,
                    to: [member.email],
                    subject: subject,
                    text: '',
                    html: htmlEmail,
                };

                await sendEmail(emailOptions);
            } catch (err) {
                console.error(err);
            }
        }
    }
};

export const sendConcurrentPermanenceNotifications = async (notifications: ConcurrentPermanenceNotification[]) => {
    for (const notification of notifications) {
        try {
            const permanenceEmailData: ConcurrentPermanencesEmailData = {
                permanences: notification.permanences.map((permanence) => ({
                    name: permanence.name,
                    startAt: new Intl.DateTimeFormat('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                    }).format(new Date(permanence.start_at.getTime() + 2 * 3600000)),
                    endAt: new Intl.DateTimeFormat('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                    }).format(new Date(permanence.end_at.getTime() + 2 * 3600000)),
                    location: permanence.location,
                })),
            };

            await sendEmail({
                from: email_from,
                to: [notification.email],
                subject: '[ATTENTION] Permanences concurrentes',
                text: 'Certaines de vos permanences se chevauchent.',
                html: generateEmailHtml('templateNotifyConcurrentPermanences', permanenceEmailData),
            });
        } catch (error) {
            console.error(`Erreur lors de l'envoi du conflit de permanences a ${notification.email}`, error);
        }
    }
};
