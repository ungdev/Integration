import type { TemplateData } from '../../types/email';
import { service_url } from '../utils/secret';

export const defaultPreviewData: Record<string, TemplateData> = {
    custom: {
        title: 'Titre de démonstration',
        content: 'Premier paragraphe.\nDeuxième ligne conservée.\n\nNouvel alinéa.',
    },
    templateNotebook: {
        notebook_fr: `${service_url}api/uploads/notebooks/fr.pdf`,
        notebook_en: `${service_url}api/uploads/notebooks/en.pdf`,
    },
    templateAttributionBus: {
        bus: 'bus',
        time: '09h00',
    },
    templateWelcome: {
        token: 'preview-token',
    },
    templateNotifyNews: {
        title: 'Titre de démonstration',
    },
    templateNotifyTentConfirmation: {
        user1: 'Utilisateur 1',
        user2: 'Utilisateur 2',
        confirmed: true,
    },
    templateResetPassword: {
        resetLink: `${service_url}resetpassword?token=preview-token`,
    },
    templateNotifyPermanenceReminder: {
        permanence: {},
    },
    templateMentorReminder: {},
    templateNotifyTeamAssignment: {
        teamName: 'Bisounours',
        factionName: 'Dessin Animé',
    },
};
