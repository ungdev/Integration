import { db } from "../prisma/db";

export const getEventsStatus = async () => {
    const event = await db.events.findFirst();
    return event ?? null;
};

export const validateShotgun = async (teamId: number) => {
    await db.$transaction(async (tx) => {
        await tx.team_shotgun.create({ data: { team_id: teamId } });
    });
};

export const alreadyShotgun = async (teamId: number) => {
    const shotgunTeam = await db.team_shotgun.findFirst({
        where: { team_id: teamId },
        select: { id: true }
    });
    return !!shotgunTeam;
};

export const updatepreRegistrationStatus = async (preRegistrationOpen: boolean) => {
    await db.events.updateMany({ data: { pre_registration_open: preRegistrationOpen } });
    return await db.events.findMany();
};

export const updateShotgunStatus = async (shotgunOpen: boolean) => {
    await db.events.updateMany({ data: { shotgun_open: shotgunOpen } });
    return await db.events.findMany();
};

export const getAllTeamShotguns = async () => {
    const results = await db.team_shotgun.findMany({
        orderBy: [{ timestamp: 'asc' }, { id: 'asc' }],
        include: { teams: { select: { name: true, type: true } } }
    });
    return results.map(r => ({
        id: r.id,
        teamId: r.team_id,
        timestamp: r.timestamp,
        teamName: r.teams?.name ?? null,
        teamType: r.teams?.type ?? null,
    }));
};

export const updateSDIStatus = async (sdiOpen: boolean) => {
    await db.events.updateMany({ data: { sdi_open: sdiOpen } });
    return await db.events.findMany();
};

export const updateWEIStatus = async (weiOpen: boolean) => {
    await db.events.updateMany({ data: { wei_open: weiOpen } });
    return await db.events.findMany();
};

export const updateFoodStatus = async (foodOpen: boolean) => {
    await db.events.updateMany({ data: { food_open: foodOpen } });
    return await db.events.findMany();
};

export const updateChallStatus = async (challOpen: boolean) => {
    await db.events.updateMany({ data: { chall_open: challOpen } });
    return await db.events.findMany();
};
