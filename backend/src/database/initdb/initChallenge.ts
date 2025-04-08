import { db } from "../db";  // Assurez-vous que votre instance db est correcte
import {challengeSchema } from "../../schemas/Basic/challenge.schema";

export const initChallenge = async () => {
    const existingChall = await db.select().from(challengeSchema).limit(1);
  
    // Si il n'y a pas de ligne existante, insérer une nouvelle ligne
    if (existingChall.length === 0) {
        const challengeValues = {
            title: "Free", 
            description: "Chalenge de réfrence pour les points gratuits", 
            category : "Free", 
            points: 0, 
            created_by : "1"
        };
        const result = await db.insert(challengeSchema).values(challengeValues).onConflictDoNothing();
    }
  };