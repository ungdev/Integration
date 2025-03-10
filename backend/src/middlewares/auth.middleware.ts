import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Unauthorized } from "../utils/responses"; // Assurez-vous que cette fonction est bien définie
import { jwtSecret } from "../utils/secret";
import { decodeToken } from "../utils/token";


export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return Unauthorized(res, { msg: "Unauthorized: Missing or malformed token" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = decodeToken(token);

        req.user = decoded; // Ajoute les données du token à l'objet `req`
        next();
    } catch (error) {
        return Unauthorized(res, { msg: "Unauthorized: Invalid or expired token" });
    }
};
