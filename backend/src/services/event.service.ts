import { db } from "../database/db";
import { eq } from "drizzle-orm";
import { eventSchema } from "../schemas/Basic/event.schema";
import { teamShotgunSchema } from "../schemas/Relational/teamshotgun.schema";

export const getEventsStatus = async () => {
    const events = await db.select().from(eventSchema); 
    if (events.length > 0) {
      return events[0];  // Renvoie le premier événement s'il existe
    } else {
      return null;  // ou une valeur par défaut
    }
  };

export const validateShotgun = async (teamId: number) => {
  return await db.insert(teamShotgunSchema).values({ team_id: teamId }).returning();
};

export const alreadyShotgun = async (teamId: number) => {
    const shotgunTeam = await db.select({shotgunId : teamShotgunSchema.id})
    .from(teamShotgunSchema)
    .where(eq(teamShotgunSchema.team_id, teamId));

    if(shotgunTeam[0]){
        return true
    }
    else{
        return false
    }
  };

export const updatepreRegistrationStatus = async (preRegistrationOpen: boolean) => {
    return await db.update(eventSchema)
      .set({pre_registration_open: preRegistrationOpen})
      .returning();
};

export const updateShotgunStatus = async ( shotgunOpen: boolean) => {
    return await db.update(eventSchema)
      .set({ shotgun_open: shotgunOpen })
      .returning();
  };
