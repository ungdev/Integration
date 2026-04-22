import { and, eq } from "drizzle-orm";
import { db } from "../database/db";
import { roleSchema } from "../schemas/Basic/role.schema";
import { userSchema } from "../schemas/Basic/user.schema";
import { rolePoints } from "../schemas/Relational/rolepoints.schema";
import {
    userPreferencesSchema,
    UserRole,
    userRolesSchema,
} from "../schemas/Relational/userroles.schema";

// 1. Ajouter un rôle à un utilisateur
export const assignRoleToUser = async (userId: number, roleId: number) => {
    const existing = await db
        .select()
        .from(userRolesSchema)
        .where(and(eq(userRolesSchema.user_id, userId), eq(userRolesSchema.role_id, roleId)));

    if (existing.length > 0) return;

    const newUserRole: UserRole = { user_id: userId, role_id: roleId };
    await db.insert(userRolesSchema).values(newUserRole);
};

// 2. Supprimer un rôle d'un utilisateur
export const removeRoleFromUser = async (userId: number, roleId: number) => {
    await db
        .delete(userRolesSchema)
        .where(and(eq(userRolesSchema.user_id, userId), eq(userRolesSchema.role_id, roleId)));
};

// 3. Récupérer les rôles d'un utilisateur
export const getUserRoles = async (userId: number) => {
    return await db
        .select({
            roleId: roleSchema.id,
            roleName: roleSchema.name,
        })
        .from(userRolesSchema)
        .innerJoin(roleSchema, eq(userRolesSchema.role_id, roleSchema.id))
        .where(eq(userRolesSchema.user_id, userId));
};

// 4. Récupérer tous les utilisateurs avec leurs rôles
export const getUsersWithRoles = async () => {
    return await db
        .select({
            userId: userSchema.id,
            firstName: userSchema.first_name,
            lastName: userSchema.last_name,
            roleName: roleSchema.name,
        })
        .from(userRolesSchema)
        .innerJoin(userSchema, eq(userRolesSchema.user_id, userSchema.id))
        .innerJoin(roleSchema, eq(userRolesSchema.role_id, roleSchema.id));
};

// 5. Récupérer les utilisateurs par nom de rôle
export const getUsersByRoleName = async (roleName: string) => {
    const role = await db
        .select()
        .from(roleSchema)
        .where(eq(roleSchema.name, roleName))
        .limit(1);

    if (role.length === 0) throw new Error("Rôle non trouvé");

    const roleId = role[0].id;

    return await db
        .select({
            userId: userSchema.id,
            firstName: userSchema.first_name,
            lastName: userSchema.last_name,
            email: userSchema.email,
            contact: userSchema.contact,
            roleName: roleSchema.name,
        })
        .from(userPreferencesSchema)
        .innerJoin(userSchema, eq(userPreferencesSchema.userId, userSchema.id))
        .innerJoin(roleSchema, eq(userPreferencesSchema.roleId, roleSchema.id))
        .where(eq(userPreferencesSchema.roleId, roleId));
};

// 6. Mettre à jour les préférences d'un utilisateur
export const updateUserPreferences = async (userId: number, roleIds: number[]) => {
    await db.delete(userPreferencesSchema).where(eq(userPreferencesSchema.userId, userId));

    const newPreferences = roleIds.map((roleId) => ({ userId, roleId }));
    await db.insert(userPreferencesSchema).values(newPreferences);
};

// 7. Récupérer les préférences d'un utilisateur
export const getUserPreferences = async (userId: number) => {
    return await db
        .select({
            roleId: roleSchema.id,
            roleName: roleSchema.name,
        })
        .from(userPreferencesSchema)
        .innerJoin(roleSchema, eq(userPreferencesSchema.roleId, roleSchema.id))
        .where(eq(userPreferencesSchema.userId, userId));
};

// 8. Récupérer tous les rôles disponibles
export const getAllRoles = async () => {
    return await db
        .select({
            roleId: roleSchema.id,
            name: roleSchema.name,
            description: roleSchema.description,
        })
        .from(roleSchema);
};


// 9. Ajouter des points à un rôle
export const addPointsToRole = async (roleId: number, pointsToAdd: number) => {
    const existing = await db
        .select()
        .from(rolePoints)
        .where(eq(rolePoints.role_id, roleId))
        .limit(1);

    if (existing.length === 0) {
        await db.insert(rolePoints).values({ role_id: roleId, points: pointsToAdd });
    } else {
        const newPoints = existing[0].points + pointsToAdd;
        await db
            .update(rolePoints)
            .set({ points: newPoints })
            .where(eq(rolePoints.role_id, roleId));
    }
};

// 10. Retirer des points à un rôle
export const removePointsFromRole = async (roleId: number, pointsToRemove: number) => {
    const existing = await db
        .select()
        .from(rolePoints)
        .where(eq(rolePoints.role_id, roleId))
        .limit(1);

    if (existing.length === 0) {
        throw new Error("Rôle introuvable");
    }

    const newPoints = Math.max(0, existing[0].points - pointsToRemove);
    await db
        .update(rolePoints)
        .set({ points: newPoints })
        .where(eq(rolePoints.role_id, roleId));
};

// 11. Récupérer les points de tous les rôles
export const getAllRolePoints = async () => {
    return await db.select().from(rolePoints);
};

// 12. Récupérer les points d'un rôle spécifique
export const getRolePoints = async (roleId: number) => {
    const result = await db
        .select()
        .from(rolePoints)
        .where(eq(rolePoints.role_id, roleId))
        .limit(1);

    return result[0] ?? null;
};

// 13. Checker le role d'User
export const checkRoleUser = async (userId: number, roleId: number) => {
    const existingRole = await db
        .select()
        .from(userRolesSchema)
        .where(and(eq(userRolesSchema.user_id, userId), eq(userRolesSchema.role_id, roleId)));

    return existingRole;
};

// 13. Ajouter un role à l'User
export const insertUserRole = async (userId: number, roleId: number) => {
    const newUserRole: UserRole = { user_id: userId, role_id: roleId }
    await db.insert(userRolesSchema).values(newUserRole);
}

// 13. Recevoir tout les roles
export const getRoles = async () => {
    try {
        const roles = await db.select({
            roleId: roleSchema.id,
            name: roleSchema.name,
            description: roleSchema.description
        }).from(roleSchema);
        return roles;
    }
    catch (error) {
        throw new Error("Erreur lors de la récupération des rôles : " + error.message);
    }
}
