import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../utils/secret';
import { Unauthorized } from '../utils/responses';

// Middleware pour vérifier le rôle
export const checkRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {

    if (!req.user) {
       Unauthorized(res,{ msg: 'Accès non autorisé' });
       return;
    }
    const user = req.user
    try {
      if (user.userPermission !== requiredRole && user.userPermission !== 'Admin'){
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
