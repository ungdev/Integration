import { eq, and } from "drizzle-orm";
import { db } from "../database/db";
import { userPreferencesSchema, UserRole, userRolesSchema } from "../schemas/Relational/userroles.schema";
import { roleSchema } from "../schemas/Basic/role.schema";
import { userSchema } from "../schemas/Basic/user.schema";

export const updateUserPreferences = async(userId: any , roleIds: any )=>{
    try{
          // Supprime les anciennes préférences
          await db.delete(userPreferencesSchema).where(eq(userPreferencesSchema.userId, userId));
      
          // Ajoute les nouvelles préférences
          const newPreferences = roleIds.map((roleId) => ({ userId, roleId }));
          await db.insert(userPreferencesSchema).values(newPreferences);

    }
    catch(error){
        throw new Error("Une erreure est survenue lors de la mise à jour des preferences"+error)
    }
}

export const getUserPreferences = async(userId: any)=>{
    try{
          
          const result = await db.select().from(userPreferencesSchema).where(eq(userPreferencesSchema.userId, userId));
          return result;
      
    }
    catch(error){
        throw new Error("Une erreure est survenue lors de la mise à jour des preferences")
    }
}

// Dans ton service role.service.ts

// Service pour récupérer les utilisateurs par rôle
export const getUsersByRole = async (roleName: string) => {
    try {
      // Récupérer le roleId en fonction du nom du rôle
      const role = await db.select().from(roleSchema).where(eq(roleSchema.name, roleName)).limit(1);
      
      if (role.length === 0) {
        throw new Error("Role non trouvé");
      }
  
      const roleId = role[0].id;
  
      // Joindre les tables `user`, `role` et `user_preference`
      const usersWithPreferences = await db
        .select({
          userId: userSchema.id,
          firstName: userSchema.first_name,
          lastName: userSchema.last_name,
          email: userSchema.email,
          roleName: roleSchema.name,
        })
        .from(userPreferencesSchema)
        .innerJoin(userSchema, eq(userPreferencesSchema.userId, userSchema.id))
        .innerJoin(roleSchema, eq(userPreferencesSchema.roleId, roleSchema.id))
        .where(eq(userPreferencesSchema.roleId, roleId));
        
      return usersWithPreferences;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des utilisateurs par preferences : " + error.message);
    }
  };

export const checkRoleUser = async (userId: number, roleId: number) =>{

  const existingRole = await db
        .select()
        .from(userRolesSchema)
        .where(and(eq(userRolesSchema.user_id, userId), eq(userRolesSchema.role_id, roleId)));
    
    return existingRole;
};

export const insertUserRole = async(userId: number, roleId: number) =>{

    const newUserRole : UserRole = {user_id: userId, role_id: roleId}
    await db.insert(userRolesSchema).values(newUserRole);
}

export const removeRoleFromUser = async(userId: number, roleId: number)=>{
    
    await db.delete(userRolesSchema)
    .where(and(eq(userRolesSchema.user_id,userId),eq(userRolesSchema.role_id, roleId)));
}

export const getUsersWithRoles = async () => {
    try{
        const response = await db
        .select({
        userId: userSchema.id,
        firstName: userSchema.first_name,
        lastName: userSchema.last_name,
        roleName: roleSchema.name,
        })
        .from(userRolesSchema)  // Joins with userRoles schema
        .innerJoin(userSchema, eq(userRolesSchema.user_id, userSchema.id))  // Join users to user_roles using user_id
        .innerJoin(roleSchema, eq(userRolesSchema.role_id, roleSchema.id));  // Join roles to user_roles using role_id

        return response;
    }
    catch(error){
        throw new Error("Erreur lors de la récupération des utilisateurs par rôle : " + error.message);
    }

};

export const getRoles = async()=>{
    try{
        const roles = await db.select({
            roleId: roleSchema.id,
            name: roleSchema.name,
            description: roleSchema.description
        }).from(roleSchema);
        return roles;
    }
    catch(error){
        throw new Error("Erreur lors de la récupération des rôles : " + error.message);
    }

}



  
  