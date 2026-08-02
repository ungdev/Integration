import { eq, inArray } from 'drizzle-orm';
import { db } from '../../database/db';
import { factionSchema } from '../../schemas/Basic/faction.schema';
import { teamSchema } from '../../schemas/Basic/team.schema';
import { teamFactionSchema } from '../../schemas/Relational/teamfaction.schema';
import { generateEmailHtml, sendEmail } from '../email.service';
import type { TeamAssignmentNotification } from '../../types/team';
import { email_from, email_concurrency } from '../../shared/secrets/secrets';
import type { TeamAssignmentEmailData } from '../../types/email';
import getPLimit from '../../shared/utils/pLimit';

/**
 * Envoie un email de notification à chaque étudiant venant d'être
 * assigné à une équipe, l'informant de son équipe et de sa faction.
 *
 * Fonctionnement :
 * 1. Récupère en base les informations (nom d'équipe + nom de faction)
 *    pour chaque équipe unique concernée par les notifications, afin
 *    d'éviter les requêtes redondantes.
 * 2. Pré-génère et met en cache le HTML de l'email pour chaque équipe
 *    (un seul rendu de template par équipe, même si plusieurs élèves
 *    y sont assignés).
 * 3. Envoie les emails en parallèle avec une limite de concurrence
 *    (`email_concurrency`) afin de ne pas surcharger le service d'envoi.
 * 4. Logue les échecs d'envoi sans interrompre le traitement des autres
 *    emails (utilisation de `Promise.allSettled`).
 *
 * Ne fait rien si la liste de notifications est vide.
 *
 * @param notifications - Liste des notifications d'assignation
 *                         (email de l'étudiant + identifiant de l'équipe)
 *                         pour lesquelles envoyer un email.
 * @throws Ne rejette pas globalement : les erreurs d'envoi individuelles
 *         sont capturées et simplement loguées dans la console.
 */
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
            socialLink: teamSchema.social_link,
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
            teamSocialLink: team.socialLink,
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

export default sendEmailToNewAssignedStudents;
