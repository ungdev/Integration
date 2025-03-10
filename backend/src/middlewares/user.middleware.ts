import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../utils/secret';
import { Unauthorized } from '../utils/responses';

// Middleware pour vérifier le rôle
export const checkRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
       Unauthorized(res,{ msg: 'Accès non autorisé' });
       return;
    }

    try {
      const decoded: any = jwt.verify(token, jwtSecret);
      if (decoded.userPermission !== requiredRole) {
         Unauthorized(res,{ msg: 'Accès interdit, rôle insuffisant' });
         return;
      }
      next();
    } catch (err) {
       Unauthorized(res,{ msg: 'Token invalide ou expiré' });
       return;
    }
  };
};
