import { eq, inArray } from 'drizzle-orm';
import { db } from '../database/db';
import { factionSchema } from '../schemas/Basic/faction.schema';
import { teamSchema } from '../schemas/Basic/team.schema';
import { userSchema } from '../schemas/Basic/user.schema';
import { teamFactionSchema } from '../schemas/Relational/teamfaction.schema';
import { teamShotgunSchema } from '../schemas/Relational/teamshotgun.schema';
import { userTeamsSchema } from '../schemas/Relational/userteams.schema';
import { getFaction } from './faction.service';
import { generateEmailHtml, sendEmail } from './email.service';
import * as team_service from '../services/team.service';
import * as user_service from '../services/user.service';
import type { StudentRow, TeamMemberRow, TeamRow, TeamSizeRow, TeamAssignmentNotification } from '../dto/team.dto';
import { email_from, email_concurrency } from '../utils/secret';
import type { TeamAssignmentEmailData } from '../../types/email';
import getPLimit from '../utils/pLimit';

export const createTeam = async (teamName: string, members: number[]) => {
    const newTeam = await db.insert(teamSchema).values({ name: teamName }).returning();
    const teamId = newTeam[0].id;

    await Promise.all(members.map((userId) => db.insert(userTeamsSchema).values({ team_id: teamId, user_id: userId })));

    return newTeam;
};

export const createTeamLight = async (teamName: string, factionId: number) => {
    const newTeam = await db.insert(teamSchema).values({ name: teamName }).returning({ teamId: teamSchema.id });

    if (factionId) {
        await db.insert(teamFactionSchema).values({ faction_id: factionId, team_id: newTeam[0].teamId });
    }

    return newTeam;
};

export const getUserTeam = async (userId: number) => {
    const userTeam = await db
        .select({ userTeamId: userTeamsSchema.team_id })
        .from(userTeamsSchema)
        .where(eq(userTeamsSchema.user_id, userId));

    return userTeam[0]?.userTeamId;
};

export const getUserTeamDisplayInfos = async (userId: number) => {
    return (
        await db
            .select({
                id: teamSchema.id,
                name: teamSchema.name,
                faction_id: factionSchema.id,
                faction_name: factionSchema.name,
                social_link: teamSchema.social_link,
            })
            .from(userTeamsSchema)
            .innerJoin(teamSchema, eq(teamSchema.id, userTeamsSchema.team_id))
            .innerJoin(teamFactionSchema, eq(teamFactionSchema.team_id, teamSchema.id))
            .innerJoin(factionSchema, eq(factionSchema.id, teamFactionSchema.faction_id))
            .where(eq(userTeamsSchema.user_id, userId))
    )[0];
};

export const getTeams = async () => {
    const teams = await db
        .select({
            teamId: teamSchema.id,
            name: teamSchema.name,
            description: teamSchema.description,
            type: teamSchema.type,
            socialLink: teamSchema.social_link,
        })
        .from(teamSchema);

    return teams;
};

export const getTeamsAll = async () => {
    const teams = await db.select().from(teamSchema);

    const teamsWithFaction = await Promise.all(
        teams.map(async (team) => {
            const teamFactionId = await getTeamFaction(team.id);
            const teamFaction = await getFaction(teamFactionId);
            return {
                ...team,
                teamFaction,
            };
        }),
    );
    return teamsWithFaction;
};

export const modifyTeam = async (
    teamID: number,
    teamMembers: number[],
    factionID: number,
    socialLink: string,
    name?: string,
    type?: string,
) => {
    // 1. Mise à jour des champs de l'équipe
    if (name !== undefined) {
        await db.update(teamSchema).set({ name: name }).where(eq(teamSchema.id, teamID));
    }
    if (type !== undefined) {
        await db.update(teamSchema).set({ type: type }).where(eq(teamSchema.id, teamID));
    }
    if (socialLink !== undefined) {
        await db.update(teamSchema).set({ social_link: socialLink }).where(eq(teamSchema.id, teamID));
    }

    // 2. Mise à jour des membres de l'équipe (remplace les anciens)
    if (teamMembers.length !== 0) {
        if (Array.isArray(teamMembers)) {
            // Supprimer les anciens membres
            await db.delete(userTeamsSchema).where(eq(userTeamsSchema.team_id, teamID));

            // Ajouter les nouveaux
            if (teamMembers.length > 0) {
                await db.insert(userTeamsSchema).values(
                    teamMembers.map((userID) => ({
                        user_id: userID,
                        team_id: teamID,
                    })),
                );
            }
        }
    } else {
        await db.delete(userTeamsSchema).where(eq(userTeamsSchema.team_id, teamID));
    }

    // 3. Mise à jour de la faction (remplace la relation précédente)
    if (factionID !== undefined) {
        // Supprimer l'ancienne relation
        await db.delete(teamFactionSchema).where(eq(teamFactionSchema.team_id, teamID));

        // Ajouter la nouvelle
        await db.insert(teamFactionSchema).values({
            team_id: teamID,
            faction_id: factionID,
        });
    }

    // 4. Retour de la team modifiée
    const updatedTeam = await db.select().from(teamSchema).where(eq(teamSchema.id, teamID));

    return updatedTeam[0];
};

export const getTeamUsers = async (teamId: any) => {
    const users = await db
        .select({
            userId: userSchema.id,
            firstName: userSchema.first_name,
            lastName: userSchema.last_name,
            email: userSchema.email,
            permission: userSchema.permission,
        })
        .from(userSchema)
        .innerJoin(userTeamsSchema, eq(userSchema.id, userTeamsSchema.user_id))
        .where(eq(userTeamsSchema.team_id, teamId));

    return users;
};

export const getAllTeamsWithUsers = async () => {
    const results = await db
        .select({
            teamId: teamSchema.id,
            teamName: teamSchema.name,
            teamType: teamSchema.type,
            teamFaction: factionSchema.name,
            userId: userSchema.id,
            firstName: userSchema.first_name,
            lastName: userSchema.last_name,
            discordId: userSchema.discord_id,
            permission: userSchema.permission,
        })
        .from(teamSchema)
        .innerJoin(userTeamsSchema, eq(teamSchema.id, userTeamsSchema.team_id))
        .innerJoin(userSchema, eq(userSchema.id, userTeamsSchema.user_id))
        .innerJoin(teamFactionSchema, eq(teamSchema.id, teamFactionSchema.team_id))
        .innerJoin(factionSchema, eq(factionSchema.id, teamFactionSchema.faction_id));

    const teamsMap = new Map<
        number,
        {
            id: number;
            name: string;
            type: string;
            faction: string;
            users: Array<{
                id: number;
                firstName: string;
                lastName: string;
                discordId: string;
                permission: string;
            }>;
        }
    >();

    for (const row of results) {
        if (!teamsMap.has(row.teamId)) {
            teamsMap.set(row.teamId, {
                id: row.teamId,
                name: row.teamName,
                type: row.teamType,
                faction: row.teamFaction,
                users: [],
            });
        }

        teamsMap.get(row.teamId)!.users.push({
            id: row.userId,
            firstName: row.firstName,
            lastName: row.lastName,
            discordId: row.discordId,
            permission: row.permission,
        });
    }

    return Array.from(teamsMap.values());
};

export const getTeamFaction = async (teamId: any) => {
    const teamFactionId = await db
        .select({ faction_id: teamFactionSchema.faction_id })
        .from(teamFactionSchema)
        .where(eq(teamFactionSchema.team_id, teamId));

    if (teamFactionId.length > 0 && teamFactionId[0].faction_id) {
        return teamFactionId[0].faction_id;
    } else {
        return 0;
    }
};

export const deleteTeam = async (teamID: number) => {
    // 1. Supprimer la relation avec les utilisateurs (table user_teams)
    await db.delete(userTeamsSchema).where(eq(userTeamsSchema.team_id, teamID));

    // 2. Supprimer la relation avec la faction (table team_faction)
    await db.delete(teamFactionSchema).where(eq(teamFactionSchema.team_id, teamID));

    // 3. Supprimer la relation avec les utilisateurs (table user_teams)
    await db.delete(teamShotgunSchema).where(eq(teamShotgunSchema.team_id, teamID));

    // 4. Supprimer l'équipe de la table principale (teams)
    const deletedTeam = await db.delete(teamSchema).where(eq(teamSchema.id, teamID)).returning();

    // Si aucune équipe n'est supprimée, on retourne une erreur
    if (deletedTeam.length === 0) {
        throw new Error('Équipe non trouvée.');
    }

    return deletedTeam[0]; // Retourne les informations de l'équipe supprimée
};

export const addTeamMember = async (teamId: number, userId: number) => {
    const newTeamMember = await db.insert(userTeamsSchema).values({ user_id: userId, team_id: teamId });

    return newTeamMember;
};

export const getUsersWithTeam = async () => {
    try {
        const userswithteam = await db
            .select({
                userId: userTeamsSchema.user_id,
                teamId: userTeamsSchema.team_id,
            })
            .from(userTeamsSchema);

        return userswithteam;
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs possédant une team ', err);
        throw new Error('Erreur de base de données');
    }
};

export const getTeam = async (teamId: any) => {
    try {
        const team = await db
            .select({
                teamId: teamSchema.id,
                teamName: teamSchema.name,
            })
            .from(teamSchema)
            .where(eq(teamSchema.id, teamId));

        return team[0];
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs possédant une team ', err);
        throw new Error('Erreur de base de données');
    }
};

export const teamDistribution = async () => {
    const newStudents = (await user_service.getUsersbyPermission('Nouveau')) as StudentRow[];
    const userswithteams = ((await getUsersWithTeam()) as TeamMemberRow[]).map((entry) => entry.userId);
    const teams = (await team_service.getTeams()) as TeamRow[];

    // Filtrer les étudiants qui ne sont pas déjà assignés à une équipe
    const filteredStudents = newStudents
        // .filter((student: StudentRow) => student.branch !== "RI") // A decommenter pour ignorer les RI dans la répartition automatique
        .filter((student) => !userswithteams.includes(student.userId));

    // Filtrer les utilisateurs en fonction de la spécialité
    const tcStudents: StudentRow[] = filteredStudents
        .filter((student) => student.branch === 'TC')
        .map((student) => ({
            userId: student.userId,
            email: student.email,
            branch: student.branch,
        }));

    const otherStudents: StudentRow[] = filteredStudents
        // .filter((student: StudentRow) => student.branch !== "TC" && student.branch !== "RI" && student.branch !== "MM") A decommenter pour ignorer les RI dans la répartition automatique
        .filter((student) => student.branch !== 'TC' && student.branch !== 'MM')
        .map((student) => ({
            userId: student.userId,
            email: student.email,
            branch: student.branch,
        }));

    const PMOMStudents: StudentRow[] = filteredStudents
        .filter((student) => student.branch == 'MM')
        .map((student) => ({
            userId: student.userId,
            email: student.email,
            branch: student.branch,
        }));

    // Filtrer les équipes en fonction de leur type
    const tcTeams = teams.filter((team) => team.type === 'TC');
    const PMOMTeams = teams.filter((team) => team.type === 'MM');
    // const otherTeams = teams.filter(team => team.type !== "TC" && team.type !== "RI" && team.type !== "MM"); A decommenter pour ignorer les RI dans la répartition automatique
    const otherTeams = teams.filter((team) => team.type !== 'TC' && team.type !== 'MM');

    const notificationsToSend: TeamAssignmentNotification[] = [];

    // Fonction pour assigner les utilisateurs à des équipes équilibrées
    async function assignUsersToTeams(users: StudentRow[], teams: TeamRow[]) {
        if (teams.length === 0) return;

        // Calculer la taille actuelle des équipes
        const teamSizes = await Promise.all(
            teams.map(async (team) => {
                const members = await getTeamUsers(team.teamId);
                return {
                    teamId: team.teamId,
                    size: members.length,
                    teamName: team.name,
                } satisfies TeamSizeRow;
            }),
        );

        // Trier les équipes par taille (ascendant)
        teamSizes.sort((a, b) => a.size - b.size);

        for (const user of users) {
            // Assigner l'utilisateur à l'équipe avec le moins de membres
            const smallestTeam = teamSizes[0];
            await addTeamMember(smallestTeam.teamId, user.userId);

            notificationsToSend.push({
                email: user.email,
                teamId: smallestTeam.teamId,
            });

            // Mettre à jour la taille de l'équipe après l'ajout
            smallestTeam.size += 1;

            // Réordonner les équipes pour garder la plus petite en premier
            teamSizes.sort((a, b) => a.size - b.size);
        }
    }

    // Assigner les utilisateurs TC aux équipes TC
    if (tcStudents && tcTeams) {
        await assignUsersToTeams(tcStudents, tcTeams);
    }

    // Assigner les autres utilisateurs aux équipes non-TC
    if (otherStudents && otherTeams) {
        await assignUsersToTeams(otherStudents, otherTeams);
    }

    //Assigner les utilisateurs MM aux équipes MM
    if (PMOMStudents && PMOMTeams) {
        await assignUsersToTeams(PMOMStudents, PMOMTeams);
    }

    sendEmailToNewAssignedStudents(notificationsToSend);
};

const sendEmailToNewAssignedStudents = async (notifications: TeamAssignmentNotification[]) => {
    if (notifications.length === 0) {
        return;
    }

    // Récupération des équipes uniques
    const uniqueTeamIds = [...new Set(notifications.map((n) => n.teamId))];

    // Récupération de toutes les équipes en DB
    const teams = await db
        .select({
            teamId: teamSchema.id,
            teamName: teamSchema.name,
            factionName: factionSchema.name,
        })
        .from(teamSchema)
        .innerJoin(teamFactionSchema, eq(teamFactionSchema.team_id, teamSchema.id))
        .innerJoin(factionSchema, eq(factionSchema.id, teamFactionSchema.faction_id))
        .where(inArray(teamSchema.id, uniqueTeamIds));

    // Cache de données pour éviter les executions multiples de fonctions
    const teamCache = new Map<number, TeamAssignmentEmailData>();
    const htmlCache = new Map<number, string>();

    // Génération des datas et du template mail pour chaque équipe concernée
    for (const team of teams) {
        const data = {
            teamName: team.teamName,
            factionName: team.factionName,
        };

        teamCache.set(team.teamId, data);

        htmlCache.set(team.teamId, generateEmailHtml('templateNotifyTeamAssignment', data));
    }

    const pLimit = await getPLimit();
    const limit = pLimit(Number(email_concurrency));

    const results = await Promise.allSettled(
        notifications.map((notification) =>
            limit(async () => {
                const html = htmlCache.get(notification.teamId);

                if (!html) {
                    throw new Error(`No email template found for team ${notification.teamId}`);
                }

                await sendEmail({
                    from: email_from,
                    to: [notification.email],
                    subject: '[EN BELOW] Tu as été affecté à une équipe !',
                    text: '',
                    html,
                });
            }),
        ),
    );

    // Log des erreurs
    const failures = results.filter((result): result is PromiseRejectedResult => result.status === 'rejected');

    if (failures.length > 0) {
        console.error(
            `${failures.length} email(s) failed to send.`,
            failures.map((f) => f.reason),
        );
    }
};
