import { type NextFunction, type Request, type Response } from 'express';
import { Unauthorized } from '../shared/http/responses'; // Assurez-vous que cette fonction est bien définie
import { decodeToken } from '../shared/utils/token';

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return Unauthorized(res, { msg: 'Unauthorized: Missing or malformed token' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = decodeToken(token);

        req.user = decoded; // Ajoute les données du token à l'objet `req`
        next();
    } catch {
        return Unauthorized(res, { msg: 'Unauthorized: Invalid or expired token' });
    }
};
