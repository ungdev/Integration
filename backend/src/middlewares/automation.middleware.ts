import { type NextFunction, type Request, type Response } from 'express';
import { Unauthorized } from '../shared/http/responses'; // Assurez-vous que cette fonction est bien définie
import { automation_token } from '../shared/secrets/secrets';

export const authenticateAutomation = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;

        if (!token) {
            return Unauthorized(res, { msg: 'Unauthorized: Missing or malformed token' });
        }

        if (token !== automation_token) {
            return Unauthorized(res, { msg: 'Unauthorized: Invalid token' });
        }

        next();
    } catch {
        return Unauthorized(res, { msg: 'Unauthorized: Invalid token' });
    }
};
