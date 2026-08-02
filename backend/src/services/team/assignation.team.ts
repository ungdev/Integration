import { eq, inArray } from 'drizzle-orm';
import { db } from '../../database/db';
import { userSchema } from '../../schemas/Basic/user.schema';
import { userTeamsSchema } from '../../schemas/Relational/userteams.schema';
import type { StudentRow, TeamRow, TeamDistributionState, TeamAssignmentNotification } from '../../types/team';

/**
 * Détermine si un(e) étudiant(e) est une fille.
 * Le champ `male` peut être stocké sous forme de booléen ou de nombre (0/1),
 * on gère donc les deux cas : `false` ou `0` signifient "fille".
 *
 * @param student - La ligne étudiant à tester.
 * @returns `true` si l'étudiant(e) est une fille, sinon `false`.
 */
const isFemale = (student: StudentRow) => {
    const maleValue: unknown = student.male;
    return maleValue === false || maleValue === 0;
};

/**
 * Ajoute un utilisateur à une équipe en créant l'entrée correspondante
 * dans la table de liaison `userTeamsSchema`.
 *
 * @param teamId - Identifiant de l'équipe cible.
 * @param userId - Identifiant de l'utilisateur à ajouter.
 * @returns Le résultat de l'insertion en base de données.
 */
export const addTeamMember = async (teamId: number, userId: number) =>
    await db.insert(userTeamsSchema).values({ user_id: userId, team_id: teamId });

/**
 * Compare deux équipes candidates afin de déterminer laquelle est
 * la plus adaptée pour recevoir un nouvel étudiant, dans le but
 * d'équilibrer les équipes en taille et en mixité.
 *
 * Logique :
 * - Si l'étudiant(e) est une fille : on privilégie l'équipe avec le moins
 *   de filles, puis la plus petite taille, puis le plus petit teamId (déterminisme).
 * - Si l'étudiant est un garçon : on privilégie la plus petite taille,
 *   puis le moins de filles, puis le plus petit teamId.
 *
 * @param candidate - L'équipe candidate à évaluer.
 * @param currentBest - La meilleure équipe trouvée jusqu'à présent.
 * @param female - `true` si l'étudiant à placer est une fille.
 * @returns `true` si `candidate` est un meilleur choix que `currentBest`.
 */
const isBetterTeam = (candidate: TeamDistributionState, currentBest: TeamDistributionState, female: boolean) => {
    if (female) {
        if (candidate.girlsCount !== currentBest.girlsCount) {
            return candidate.girlsCount < currentBest.girlsCount;
        }

        if (candidate.size !== currentBest.size) {
            return candidate.size < currentBest.size;
        }

        return candidate.teamId < currentBest.teamId;
    }

    if (candidate.size !== currentBest.size) {
        return candidate.size < currentBest.size;
    }

    if (candidate.girlsCount !== currentBest.girlsCount) {
        return candidate.girlsCount < currentBest.girlsCount;
    }

    return candidate.teamId < currentBest.teamId;
};

/**
 * Construit, pour chaque équipe candidate, un état de distribution
 * (`TeamDistributionState`) contenant sa taille actuelle et son nombre
 * de filles, en interrogeant les membres déjà assignés en base de données.
 *
 * @param candidateTeams - Liste des équipes à analyser.
 * @returns Un tableau d'états d'équipe (taille + nombre de filles),
 *          ou un tableau vide si aucune équipe n'est fournie.
 */
const buildTeamStates = async (candidateTeams: TeamRow[]) => {
    if (candidateTeams.length === 0) {
        return [] as TeamDistributionState[];
    }

    const teamIds = candidateTeams.map((team) => team.teamId);
    const assignedMembers = await db
        .select({
            teamId: userTeamsSchema.team_id,
            male: userSchema.male,
        })
        .from(userTeamsSchema)
        .innerJoin(userSchema, eq(userSchema.id, userTeamsSchema.user_id))
        .where(inArray(userTeamsSchema.team_id, teamIds));

    const teamStates = new Map<number, TeamDistributionState>();

    for (const team of candidateTeams) {
        teamStates.set(team.teamId, {
            ...team,
            size: 0,
            girlsCount: 0,
        });
    }

    for (const member of assignedMembers) {
        const teamState = teamStates.get(member.teamId);

        if (!teamState) {
            continue;
        }

        teamState.size += 1;

        const maleValue: unknown = member.male;

        if (maleValue === false || maleValue === 0) {
            teamState.girlsCount += 1;
        }
    }

    return Array.from(teamStates.values());
};

/**
 * Répartit une liste d'utilisateurs (étudiants) dans les équipes fournies,
 * en cherchant à équilibrer à la fois la taille des équipes et la mixité
 * (nombre de filles par équipe).
 *
 * Pour chaque utilisateur :
 * 1. On détermine s'il s'agit d'une fille.
 * 2. On sélectionne la meilleure équipe selon `isBetterTeam`.
 * 3. On l'ajoute à cette équipe en base de données.
 * 4. On déclenche une notification d'assignation.
 * 5. On met à jour l'état local de l'équipe (taille et nombre de filles)
 *    pour que les assignations suivantes en tiennent compte.
 *
 * Ne fait rien si la liste des équipes ou des utilisateurs est vide.
 *
 * @param users - Liste des étudiants à assigner.
 * @param teams - Liste des équipes disponibles.
 * @param addNotification - Callback appelé après chaque assignation
 *                           pour notifier l'utilisateur de son équipe.
 */
async function assignUsersToTeams(
    users: StudentRow[],
    teams: TeamRow[],
    addNotification: (notification: TeamAssignmentNotification) => Promise<void>,
) {
    if (teams.length === 0 || users.length === 0) return;

    const teamStates = await buildTeamStates(teams);

    if (teamStates.length === 0) return;

    for (const user of users) {
        const female = isFemale(user);

        let bestTeam = teamStates[0];

        for (let index = 1; index < teamStates.length; index += 1) {
            const candidate = teamStates[index];

            if (isBetterTeam(candidate, bestTeam, female)) {
                bestTeam = candidate;
            }
        }

        await addTeamMember(bestTeam.teamId, user.userId);

        await addNotification({
            email: user.email,
            teamId: bestTeam.teamId,
        });

        bestTeam.size += 1;

        if (female) {
            bestTeam.girlsCount += 1;
        }
    }
}

export default assignUsersToTeams;
