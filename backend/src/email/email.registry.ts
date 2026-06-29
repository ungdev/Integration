import type { PermanenceEmailData, TemplateRenderer } from "../../types/email";

export const templateResetPassword = 'reset-password.html';
const templateNotebook = 'notebook.html';
const templateAttributionBus = 'attribution-bus.html';
const templateWelcome = 'welcome.html';
const templateNotifyNews = 'notify-news.html';
const templateNotifyTentConfirmation = 'notify-tent-confirmation.html';
const templateNotifyPermanenceReminder = 'notify-permanence-reminder.html';

export const templateRenderers: Record<string, TemplateRenderer> = {
    custom: {
        fileName: 'custom.html',
        buildData: (data) => {
            const typedData = data as { title?: string; content?: string };
            return {
                title: typedData.title ?? '',
                content: typedData.content ?? '',
            };
        },
    },
    templateNotebook: {
        fileName: templateNotebook,
        buildData: (data) => {
            const typedData = data as {
                notebook_fr?: string;
                notebook_en?: string;
            };
            return { 
                notebook_fr: typedData.notebook_fr,
                notebook_en: typedData.notebook_en
            };
        },
    },
    templateAttributionBus: {
        fileName: templateAttributionBus,
        buildData: (data) => {
            const typedData = data as { bus?: string; time?: string };
            return { bus: typedData.bus, time: typedData.time };
        },
    },
    templateWelcome: {
        fileName: templateWelcome,
        buildData: (data) => {
            const typedData = data as { token?: string };
            return { token: typedData.token };
        },
    },
    templateNotifyNews: {
        fileName: templateNotifyNews,
        buildData: (data) => {
            const typedData = data as { title?: string };
            return { title: typedData.title };
        },
    },
    templateNotifyTentConfirmation: {
        fileName: templateNotifyTentConfirmation,
        buildData: (data) => {
            const typedData = data as { user1?: string; user2?: string; confirmed?: boolean };
            return {
                user1: typedData.user1,
                user2: typedData.user2,
                confirmed: typedData.confirmed,
            };
        },
    },
    templateResetPassword: {
        fileName: templateResetPassword,
        buildData: (data) => {
            const typedData = data as { resetLink?: string };
            return { resetLink: typedData.resetLink };
        },
    },
    templateNotifyPermanenceReminder: {
        fileName: templateNotifyPermanenceReminder,
        buildData: (data) => {
            const typedData = data as PermanenceEmailData;
            return typedData;
        },
    }
};
