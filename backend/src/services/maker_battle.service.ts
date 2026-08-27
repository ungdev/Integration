import { and, eq, inArray, not, or, sql } from 'drizzle-orm';
import { db } from '../database/db';
import { userSchema } from '../schemas/Basic/user.schema';
import { userTeamsSchema } from '../schemas/Relational/userteams.schema';
import { teamSchema } from '../schemas/Basic/team.schema';
import { teamFactionSchema } from '../schemas/Relational/teamfaction.schema';
import { MakerBattleAttributionSchema } from '../schemas/Relational/makerbattletribution.schema';

export interface UserWithTeamFaction {
    user_id: number;
    group: string;
    team_id: number;
    faction_id: number;
}

export interface TeamsWithGroup {
    maker_team_id: number;
    group: string;
}

const TEAM_SIZE = 6;
const MAX_PLACEMENT_ATTEMPTS = 20;

export const distributeGroups = async (group: string): Promise<void> => {
    let usersWithTeamsFactions = [];

    if (group === 'tc') {
        usersWithTeamsFactions = await db
            .select({
                user_id: userSchema.id,
                team_id: userTeamsSchema.team_id,
                faction_id: teamFactionSchema.faction_id,
            })
            .from(userSchema)
            .innerJoin(userTeamsSchema, eq(userSchema.id, userTeamsSchema.user_id))
            .innerJoin(teamSchema, eq(userTeamsSchema.team_id, teamSchema.id))
            .innerJoin(teamFactionSchema, eq(teamSchema.id, teamFactionSchema.team_id))
            .where(
                and(
                    eq(userSchema.permission, 'Nouveau'),
                    or(eq(userSchema.branch, 'TC'), eq(userSchema.branch, 'IA_BACH')),
                ),
            );
        usersWithTeamsFactions = usersWithTeamsFactions.map((user) => ({ ...user, group: 'tc' }));
    } else if (group === 'ri') {
        usersWithTeamsFactions = await db
            .select({
                user_id: userSchema.id,
                team_id: userTeamsSchema.team_id,
                faction_id: teamFactionSchema.faction_id,
            })
            .from(userSchema)
            .innerJoin(userTeamsSchema, eq(userSchema.id, userTeamsSchema.user_id))
            .innerJoin(teamSchema, eq(userTeamsSchema.team_id, teamSchema.id))
            .innerJoin(teamFactionSchema, eq(teamSchema.id, teamFactionSchema.team_id))
            .where(and(eq(userSchema.permission, 'Nouveau'), eq(userSchema.branch, 'RI')));
        usersWithTeamsFactions = usersWithTeamsFactions.map((user) => ({ ...user, group: 'ri' }));
    } else if (group === 'branch') {
        usersWithTeamsFactions = await db
            .select({
                user_id: userSchema.id,
                team_id: userTeamsSchema.team_id,
                faction_id: teamFactionSchema.faction_id,
            })
            .from(userSchema)
            .innerJoin(userTeamsSchema, eq(userSchema.id, userTeamsSchema.user_id))
            .innerJoin(teamSchema, eq(userTeamsSchema.team_id, teamSchema.id))
            .innerJoin(teamFactionSchema, eq(teamSchema.id, teamFactionSchema.team_id))
            .where(
                and(
                    eq(userSchema.permission, 'Nouveau'),
                    not(or(eq(userSchema.branch, 'RI'), eq(userSchema.branch, 'TC'), eq(userSchema.branch, 'IA_BACH'))),
                ),
            );
        usersWithTeamsFactions = usersWithTeamsFactions.map((user) => ({ ...user, group: 'branch' }));
    } else {
        throw new Error(`Unknown group: ${group}`);
    }

    if (usersWithTeamsFactions.length === 0) {
        return;
    }

    const usersByFaction = new Map<number, UserWithTeamFaction[]>();
    for (const user of usersWithTeamsFactions) {
        if (!usersByFaction.has(user.faction_id)) {
            usersByFaction.set(user.faction_id, []);
        }
        usersByFaction.get(user.faction_id)!.push(user);
    }

    let numberOfTeams = 0;
    for (const factionUsers of usersByFaction.values()) {
        const neededForThisFaction = Math.ceil(factionUsers.length / TEAM_SIZE);
        if (neededForThisFaction > numberOfTeams) {
            numberOfTeams = neededForThisFaction;
        }
    }

    if (numberOfTeams === 0) {
        return;
    }

    const allTeams: UserWithTeamFaction[][] = [];
    for (const [, factionUsers] of usersByFaction) {
        const teamsForFaction = generateTeamsWithRetry(factionUsers, numberOfTeams, MAX_PLACEMENT_ATTEMPTS);
        allTeams.push(...teamsForFaction);
    }

    const rows: MakerBattleAttributionSchema[] = [];
    let globalTeamId = 1;

    for (const team of allTeams) {
        for (const user of team) {
            rows.push({
                user_id: user.user_id,
                maker_team_id: globalTeamId,
                table: '',
                group: user.group,
            });
        }
        globalTeamId++;
    }

    if (rows.length > 0) {
        await db
            .insert(MakerBattleAttributionSchema)
            .values(rows)
            .onConflictDoUpdate({
                target: MakerBattleAttributionSchema.user_id,
                set: {
                    maker_team_id: sql`excluded.maker_team_id`,
                    table: sql`excluded.table`,
                },
            });
    }

    return;
};

const generateTeamsWithRetry = (
    users: UserWithTeamFaction[],
    numberOfTeams: number,
    maxAttempts = MAX_PLACEMENT_ATTEMPTS,
): UserWithTeamFaction[][] => {
    let lastError: unknown;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            const result = generateTeams(users, numberOfTeams);
            return result;
        } catch (err) {
            lastError = err;
        }
    }

    throw new Error(
        `Impossible de générer les équipes après ${maxAttempts} tentatives. ` +
            `Dernière erreur : ${lastError instanceof Error ? lastError.message : String(lastError)}`,
    );
};

export const generateTeams = (users: UserWithTeamFaction[], numberOfTeams: number): UserWithTeamFaction[][] => {
    const numberOfSixTeams = users.length - numberOfTeams * 5;
    const capacities = [...Array(numberOfSixTeams).fill(6), ...Array(numberOfTeams - numberOfSixTeams).fill(5)];

    const shuffle = <T>(array: T[]): T[] => {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    };

    const usersByTeamId = new Map<number, UserWithTeamFaction[]>();
    for (const user of users) {
        if (!usersByTeamId.has(user.team_id)) {
            usersByTeamId.set(user.team_id, []);
        }
        usersByTeamId.get(user.team_id)!.push(user);
    }

    for (const [teamId, members] of usersByTeamId) {
        usersByTeamId.set(teamId, shuffle(members));
    }

    const teams: UserWithTeamFaction[][] = capacities.map(() => []);

    let placedAllUsers = false;
    let attemptCount = 0;
    const maxAttempts = 100;

    while (!placedAllUsers && attemptCount < maxAttempts) {
        attemptCount++;

        for (let i = 0; i < teams.length; i++) {
            teams[i] = [];
        }

        const allUsers = shuffle([...users]);

        let allPlaced = true;
        for (const user of allUsers) {
            let placed = false;

            const shuffledTeamIndices = shuffle([...Array(numberOfTeams).keys()]);

            for (const teamIndex of shuffledTeamIndices) {
                if (teams[teamIndex].length < capacities[teamIndex]) {
                    const hasSameTeam = teams[teamIndex].some((u) => u.team_id === user.team_id);
                    if (!hasSameTeam) {
                        teams[teamIndex].push(user);
                        placed = true;
                        break;
                    }
                }
            }

            if (!placed) {
                for (const teamIndex of shuffledTeamIndices) {
                    if (teams[teamIndex].length < capacities[teamIndex]) {
                        teams[teamIndex].push(user);
                        placed = true;
                        break;
                    }
                }
            }

            if (!placed) {
                allPlaced = false;
                break;
            }
        }

        if (allPlaced) {
            placedAllUsers = true;
        }
    }

    if (!placedAllUsers) {
        throw new Error(`Could not place all users after ${maxAttempts} attempts`);
    }

    return teams;
};

export const placeTeamsOnTables = async (groups: string[]): Promise<void> => {
    const [{ maxTable }] = await db
        .select({
            maxTable: sql<number>`coalesce(max(nullif(${MakerBattleAttributionSchema.table}, '')::int), 0)`,
        })
        .from(MakerBattleAttributionSchema);

    let lastTable = maxTable;
    const assignments: { maker_team_id: number; table: string }[] = [];

    for (const group of groups) {
        const teams = await db
            .selectDistinct({
                maker_team_id: MakerBattleAttributionSchema.maker_team_id,
                faction_id: teamFactionSchema.faction_id,
            })
            .from(MakerBattleAttributionSchema)
            .innerJoin(userTeamsSchema, eq(MakerBattleAttributionSchema.user_id, userTeamsSchema.user_id))
            .innerJoin(teamFactionSchema, eq(userTeamsSchema.team_id, teamFactionSchema.team_id))
            .where(eq(MakerBattleAttributionSchema.group, group));

        const teamsByFaction = new Map<number, number[]>();
        for (const { maker_team_id, faction_id } of teams) {
            if (!teamsByFaction.has(faction_id)) {
                teamsByFaction.set(faction_id, []);
            }
            teamsByFaction.get(faction_id)!.push(maker_team_id);
        }

        const factionGroups = [...teamsByFaction.values()];
        const maxTeamsInAnyFaction = Math.max(0, ...factionGroups.map((group) => group.length));

        for (let i = 0; i < maxTeamsInAnyFaction; i++) {
            for (const group of factionGroups) {
                if (group[i] !== undefined) {
                    lastTable++;
                    assignments.push({ maker_team_id: group[i], table: String(lastTable) });
                }
            }
        }
    }

    if (assignments.length === 0) {
        return;
    }

    const teamIdCases = sql.join(
        assignments.map((a) => sql`WHEN ${a.maker_team_id} THEN ${a.table}`),
        sql` `,
    );

    await db
        .update(MakerBattleAttributionSchema)
        .set({ table: sql`CASE ${MakerBattleAttributionSchema.maker_team_id} ${teamIdCases} END` })
        .where(
            inArray(
                MakerBattleAttributionSchema.maker_team_id,
                assignments.map((a) => a.maker_team_id),
            ),
        );

    return;
};

export const getTableByUserId = async (userId: number): Promise<string | null> => {
    const result = await db
        .select({
            table: MakerBattleAttributionSchema.table,
        })
        .from(MakerBattleAttributionSchema)
        .where(eq(MakerBattleAttributionSchema.user_id, userId));

    return result.length > 0 ? result[0].table : null;
};
