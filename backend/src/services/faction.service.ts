import { db } from '../prisma/db';

export const getFactions = async () => {
    const factions = await db.factions.findMany({
        select: { id: true, name: true, description: true }
    });
    return factions.map(f => ({ factionId: f.id, name: f.name, description: f.description }));
};

export const getFaction = async (factionId: any) => {
    const faction = await db.factions.findUnique({
        where: { id: factionId },
        select: { id: true, name: true, description: true }
    });
    return faction ? { factionId: faction.id, name: faction.name, description: faction.description } : undefined;
};

export const createFaction = async (factionName: string) => {
    const faction = await db.factions.create({ data: { name: factionName } });
    return [faction];
};

export const deleteFaction = async (factionId: number) => {
    await db.factions.delete({ where: { id: factionId } });
};
