import { eq, and } from "drizzle-orm";
import { db } from "../database/db";
import { factionSchema } from "../schemas/Basic/faction.schema";

export const getFactions = async() => {

  const factions = await db.select(
    {factionId : factionSchema.id,
    name : factionSchema.name,
    description : factionSchema.description}).from(factionSchema);

  return factions
}

export const getFaction = async(factionId : any) => {

    const faction = await db.select(
      {factionId : factionSchema.id,
      name : factionSchema.name,
      description : factionSchema.description}).from(factionSchema).where(eq(factionSchema.id, factionId));
  
    return faction[0]
}

