import { db } from "../db";  // Assurez-vous que votre instance db est correcte
import {userSchema } from "../../schemas/Basic/user.schema";
import { zimbra_password } from "../../utils/secret";
import { hashPassword } from "../../services/auth.service";

export const initUser = async () => {
    const existingUser = await db.select().from(userSchema).limit(1);
  
    const hashedPassword = await hashPassword(zimbra_password);
    // Si il n'y a pas de ligne existante, insérer une nouvelle ligne
    if (existingUser.length === 0) {
        await db.insert(userSchema).values({
            first_name: "Integration UTT", 
            last_name: "Integration UTT", 
            email: "integration@utt.fr",
            majeur: true,
            password: hashedPassword,
            permission: 'Admin',
          });
    }
  };