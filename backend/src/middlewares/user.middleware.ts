import { type NextFunction, type Request, type Response } from "express";
import { Unauthorized } from "../utils/responses"; // adapte selon ton projet

export const checkRole = (
    requiredPermission?: string,
    requiredRoles?: string[]
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            Unauthorized(res, { msg: "Accès non autorisé" });
            return;
        }

        try {
            const isAdmin = user.userPermission === "Admin";

            const hasPermission =
                !requiredPermission || user.userPermission === requiredPermission;

            const hasRole =
                !requiredRoles ||
                (Array.isArray(user.userRoles) &&
                    user.userRoles.some((role: { roleName: string }) =>
                        requiredRoles.includes(role.roleName)
                    ));

            if (!isAdmin && !(hasPermission || hasRole)) {
                Unauthorized(res, {
                    msg: "Accès interdit, rôle ou permission insuffisants",
                });
                return;
            }

            next();
        } catch {
            Unauthorized(res, { msg: "Token invalide ou expiré" });
        }
    };
};
