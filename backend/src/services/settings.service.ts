import { asc, eq } from 'drizzle-orm';
import { db } from '../database/db';
import { eventSchema } from '../schemas/Basic/event.schema';
import { teamSchema } from '../schemas/Basic/team.schema';
import { teamShotgunSchema } from '../schemas/Relational/teamshotgun.schema';

export const settingColumns = {
    preRegistration: 'pre_registration_open',
    shotgun: 'shotgun_open',
    sdi: 'sdi_open',
    wei: 'wei_open',
    food: 'food_open',
    challenge: 'chall_open',
    makerBattleGroup: 'maker_battle_group_open',
} as const;

export type Setting = keyof typeof settingColumns;

type SettingDefinition = {
    key: Setting;
    label: string;
    column: (typeof settingColumns)[Setting];
    roles: string[];
};

export const settingDefinitions: SettingDefinition[] = [
    { key: 'preRegistration', label: 'Pré-inscription', column: 'pre_registration_open', roles: [] },
    { key: 'shotgun', label: 'Shotgun', column: 'shotgun_open', roles: [] },
    { key: 'sdi', label: 'SDI (Billetterie)', column: 'sdi_open', roles: [] },
    { key: 'wei', label: 'WEI (Billetterie + Tentes)', column: 'wei_open', roles: [] },
    { key: 'food', label: 'Nourriture (Billetterie)', column: 'food_open', roles: [] },
    { key: 'challenge', label: 'Challenges (Affichage des challenges)', column: 'chall_open', roles: [] },
    {
        key: 'makerBattleGroup',
        label: 'Groupes de défis TC & Branche (Affichage des groupes)',
        column: 'maker_battle_group_open',
        roles: [],
    },
];

export const isSetting = (setting: string): setting is Setting => setting in settingColumns;

export const getSettingsStatus = async () => {
    const events = await db.select().from(eventSchema);
    if (events.length > 0) {
        return events[0]; // Renvoie le premier événement s'il existe
    } else {
        return null; // ou une valeur par défaut
    }
};

export const getSettingStatus = async (setting: Setting) => {
    const settings = await getSettingsStatus();
    return settings ? Boolean(settings[settingColumns[setting] as keyof typeof settings]) : false;
};

const canAccessSetting = (definition: SettingDefinition, userPermission: string, userRoles: string[]) =>
    userPermission === 'Admin' ||
    definition.roles.length === 0 ||
    definition.roles.includes(userPermission) ||
    definition.roles.some((role) => userRoles.includes(role));

export const getAvailableSettings = async (userPermission: string, userRoles: string[]) => {
    const settings = await getSettingsStatus();

    return settingDefinitions
        .filter((definition) => canAccessSetting(definition, userPermission, userRoles))
        .map(({ key, label, roles, column }) => ({
            key,
            label,
            roles,
            open: settings ? Boolean(settings[column as keyof typeof settings]) : false,
        }));
};

export const getAllSettings = async () => getAvailableSettings('Admin', []);

export const validateShotgun = async (teamId: number) => {
    await db.transaction(async (tx) => {
        await tx.insert(teamShotgunSchema).values({ team_id: teamId });
    });
};

export const alreadyShotgun = async (teamId: number) => {
    const shotgunTeam = await db
        .select({ shotgunId: teamShotgunSchema.id })
        .from(teamShotgunSchema)
        .where(eq(teamShotgunSchema.team_id, teamId));

    if (shotgunTeam[0]) {
        return true;
    } else {
        return false;
    }
};

export const updateSettingStatus = async (setting: Setting, open: boolean) => {
    return await db
        .update(eventSchema)
        .set({ [settingColumns[setting]]: open })
        .returning();
};

export const getAllTeamShotguns = async () => {
    return await db
        .select({
            id: teamShotgunSchema.id,
            teamId: teamShotgunSchema.team_id,
            timestamp: teamShotgunSchema.timestamp,
            teamName: teamSchema.name,
            teamType: teamSchema.type,
        })
        .from(teamShotgunSchema)
        .leftJoin(teamSchema, eq(teamShotgunSchema.team_id, teamSchema.id))
        .orderBy(asc(teamShotgunSchema.timestamp), asc(teamShotgunSchema.id));
};
