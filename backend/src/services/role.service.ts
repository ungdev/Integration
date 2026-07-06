import { db } from "../prisma/db";

// 1. Ajouter un rôle à un utilisateur
export const assignRoleToUser = async (userId: number, roleId: number) => {
    const existing = await db.user_roles.findFirst({ where: { user_id: userId, role_id: roleId } });
    if (existing) return;
    await db.user_roles.create({ data: { user_id: userId, role_id: roleId } });
};

// 2. Supprimer un rôle d'un utilisateur
export const removeRoleFromUser = async (userId: number, roleId: number) => {
    await db.user_roles.deleteMany({ where: { user_id: userId, role_id: roleId } });
};

// 3. Récupérer les rôles d'un utilisateur
export const getUserRoles = async (userId: number) => {
    const rows = await db.user_roles.findMany({
        where: { user_id: userId },
        include: { roles: { select: { id: true, name: true } } }
    });
    return rows.map(r => ({ roleId: r.roles.id, roleName: r.roles.name }));
};

// 4. Récupérer tous les utilisateurs avec leurs rôles
export const getUsersWithRoles = async () => {
    const rows = await db.user_roles.findMany({
        include: {
            users: { select: { id: true, first_name: true, last_name: true } },
            roles: { select: { name: true } }
        }
    });
    return rows.map(r => ({
        userId: r.users.id,
        firstName: r.users.first_name,
        lastName: r.users.last_name,
        roleName: r.roles.name,
    }));
};

// 5. Récupérer les utilisateurs par nom de rôle
export const getUsersByRoleName = async (roleName: string) => {
    const role = await db.roles.findFirst({ where: { name: roleName } });
    if (!role) throw new Error("Rôle non trouvé");

    const rows = await db.user_preferences.findMany({
        where: { role_id: role.id },
        include: {
            users: { select: { id: true, first_name: true, last_name: true, email: true, contact: true } },
            roles: { select: { name: true } }
        }
    });
    return rows.map(r => ({
        userId: r.users.id,
        firstName: r.users.first_name,
        lastName: r.users.last_name,
        email: r.users.email,
        contact: r.users.contact,
        roleName: r.roles.name,
    }));
};

// 6. Mettre à jour les préférences d'un utilisateur
export const updateUserPreferences = async (userId: number, roleIds: number[]) => {
    await db.user_preferences.deleteMany({ where: { user_id: userId } });
    if (roleIds.length > 0) {
        await db.user_preferences.createMany({
            data: roleIds.map(roleId => ({ user_id: userId, role_id: roleId }))
        });
    }
};

// 7. Récupérer les préférences d'un utilisateur
export const getUserPreferences = async (userId: number) => {
    const rows = await db.user_preferences.findMany({
        where: { user_id: userId },
        include: { roles: { select: { id: true, name: true } } }
    });
    return rows.map(r => ({ roleId: r.roles.id, roleName: r.roles.name }));
};

// 8. Récupérer tous les rôles disponibles
export const getAllRoles = async () => {
    const roles = await db.roles.findMany({
        select: { id: true, name: true, description: true }
    });
    return roles.map(r => ({ roleId: r.id, name: r.name, description: r.description }));
};

// 9. Ajouter des points à un rôle
export const addPointsToRole = async (roleId: number, pointsToAdd: number) => {
    await db.role_points.upsert({
        where: { role_points: roleId },
        create: { role_points: roleId, points: pointsToAdd },
        update: { points: { increment: pointsToAdd } }
    });
};

// 10. Retirer des points à un rôle
export const removePointsFromRole = async (roleId: number, pointsToRemove: number) => {
    const existing = await db.role_points.findUnique({ where: { role_points: roleId } });
    if (!existing) throw new Error("Rôle introuvable");

    const newPoints = Math.max(0, (existing.points ?? 0) - pointsToRemove);
    await db.role_points.update({ where: { role_points: roleId }, data: { points: newPoints } });
};

// 11. Récupérer les points de tous les rôles
export const getAllRolePoints = async () => {
    return await db.role_points.findMany();
};

// 12. Récupérer les points d'un rôle spécifique
export const getRolePoints = async (roleId: number) => {
    const result = await db.role_points.findUnique({ where: { role_points: roleId } });
    return result ?? null;
};

// 13. Checker le role d'User
export const checkRoleUser = async (userId: number, roleId: number) => {
    return await db.user_roles.findMany({ where: { user_id: userId, role_id: roleId } });
};

// 14. Ajouter un role à l'User
export const insertUserRole = async (userId: number, roleId: number) => {
    await db.user_roles.create({ data: { user_id: userId, role_id: roleId } });
};

// 15. Recevoir tout les roles
export const getRoles = async () => {
    try {
        const roles = await db.roles.findMany({
            select: { id: true, name: true, description: true }
        });
        return roles.map(r => ({ roleId: r.id, name: r.name, description: r.description }));
    } catch (error) {
        throw new Error("Erreur lors de la récupération des rôles : " + error.message);
    }
};
