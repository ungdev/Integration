import { db } from "../prisma/db";
import { getFaction } from "./faction.service";

export const createTeam = async (teamName: string, members: number[]) => {
    const newTeam = await db.teams.create({ data: { name: teamName } });
    const teamId = newTeam.id;

    await db.user_teams.createMany({
        data: members.map(userId => ({ user_id: userId, team_id: teamId })),
        skipDuplicates: true,
    });

    return [newTeam];
};

export const createTeamLight = async (teamName: string, factionId: number) => {
    const newTeam = await db.teams.create({ data: { name: teamName } });

    if (factionId) {
        await db.team_faction.create({ data: { faction_id: factionId, team_id: newTeam.id } });
    }

    return [{ teamId: newTeam.id }];
};

export const getUserTeam = async (userId: number) => {
    const userTeam = await db.user_teams.findFirst({
        where: { user_id: userId },
        select: { team_id: true }
    });
    return userTeam?.team_id;
};

export const getTeams = async () => {
    const teams = await db.teams.findMany({
        select: { id: true, name: true, description: true, type: true }
    });
    return teams.map(t => ({
        teamId: t.id,
        name: t.name,
        description: t.description,
        type: t.type,
    }));
};

export const getTeamsAll = async () => {
    const teams = await db.teams.findMany();

    const teamsWithFaction = await Promise.all(
        teams.map(async (team) => {
            const teamFactionId = await getTeamFaction(team.id);
            const teamFaction = await getFaction(teamFactionId);
            return { ...team, teamFaction };
        })
    );
    return teamsWithFaction;
};

export const modifyTeam = async (teamID: number, teamMembers: number[], factionID: number, name?: string, type?: string) => {
    // 1. Mise à jour des champs de l'équipe
    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;

    if (Object.keys(updateData).length > 0) {
        await db.teams.update({ where: { id: teamID }, data: updateData });
    }

    // 2. Mise à jour des membres de l'équipe (remplace les anciens)
    if (teamMembers.length !== 0) {
        await db.user_teams.deleteMany({ where: { team_id: teamID } });
        await db.user_teams.createMany({
            data: teamMembers.map(userID => ({ user_id: userID, team_id: teamID })),
            skipDuplicates: true,
        });
    } else {
        await db.user_teams.deleteMany({ where: { team_id: teamID } });
    }

    // 3. Mise à jour de la faction (remplace la relation précédente)
    if (factionID !== undefined) {
        await db.team_faction.deleteMany({ where: { team_id: teamID } });
        await db.team_faction.create({ data: { team_id: teamID, faction_id: factionID } });
    }

    // 4. Retour de la team modifiée
    return await db.teams.findUnique({ where: { id: teamID } });
};

export const getTeamUsers = async (teamId: number) => {
    const users = await db.users.findMany({
        where: { user_teams: { some: { team_id: teamId } } },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            permission: true,
        }
    });
    return users.map(u => ({
        userId: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        permission: u.permission,
    }));
};

export const getAllTeamsWithUsers = async () => {
    const teams = await db.teams.findMany({
        include: {
            user_teams: {
                include: {
                    users: {
                        select: { id: true, first_name: true, last_name: true, discord_id: true, permission: true }
                    }
                }
            },
            team_faction: {
                include: { factions: { select: { name: true } } }
            }
        }
    });

    return teams
        .filter(t => t.user_teams.length > 0 && t.team_faction.length > 0)
        .map(team => ({
            id: team.id,
            name: team.name,
            type: team.type,
            faction: team.team_faction[0]?.factions.name ?? null,
            users: team.user_teams.map(ut => ({
                id: ut.users.id,
                firstName: ut.users.first_name,
                lastName: ut.users.last_name,
                discordId: ut.users.discord_id,
                permission: ut.users.permission,
            }))
        }));
};

export const getTeamFaction = async (teamId: number) => {
    const tf = await db.team_faction.findFirst({
        where: { team_id: teamId },
        select: { faction_id: true }
    });
    return tf?.faction_id ?? 0;
};

export const deleteTeam = async (teamID: number) => {
    const existingTeam = await db.teams.findUnique({ where: { id: teamID } });
    if (!existingTeam) throw new Error("Équipe non trouvée.");

    // 1. Supprimer la relation avec les utilisateurs (table user_teams)
    await db.user_teams.deleteMany({ where: { team_id: teamID } });
    // 2. Supprimer la relation avec la faction (table team_faction)
    await db.team_faction.deleteMany({ where: { team_id: teamID } });
    // 3. Supprimer la relation avec les utilisateurs (table user_teams)
    await db.team_shotgun.deleteMany({ where: { team_id: teamID } });
    // 4. Supprimer l'équipe de la table principale (teams)
    await db.teams.delete({ where: { id: teamID } });

    return existingTeam;
};

export const addTeamMember = async (teamId: number, userId: number) => {
    return await db.user_teams.create({ data: { user_id: userId, team_id: teamId } });
};

export const getUsersWithTeam = async () => {
    try {
        const rows = await db.user_teams.findMany({
            select: { user_id: true, team_id: true }
        });
        return rows.map(r => ({ userId: r.user_id, teamId: r.team_id }));
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs possédant une team:', err);
        throw new Error('Erreur de base de données');
    }
};

export const getTeam = async (teamId: number) => {
    try {
        const team = await db.teams.findUnique({
            where: { id: teamId },
            select: { id: true, name: true }
        });
        return team ? { teamId: team.id, teamName: team.name } : undefined;
    } catch (err) {
        console.error('Erreur lors de la récupération de la team:', err);
        throw new Error('Erreur de base de données');
    }
};
