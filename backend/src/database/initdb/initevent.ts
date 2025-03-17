import { db } from "../db";  // Assurez-vous que votre instance db est correcte
import {eventSchema } from "../../schemas/Basic/event.schema";

export const initEvent = async () => {
    const existingEvent = await db.select().from(eventSchema).limit(1);
  
    // Si il n'y a pas de ligne existante, insérer une nouvelle ligne
    if (existingEvent.length === 0) {
      await db.insert(eventSchema).values({ pre_registration_open: false, shotgun_open: false }).onConflictDoNothing();
    }
  };