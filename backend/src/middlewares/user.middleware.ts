import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../utils/secret';

// Middleware pour vérifier le rôle
export const checkRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé' });
    }

    try {
      const decoded: any = jwt.verify(token, jwtSecret);
      if (decoded.role !== requiredRole) {
        return res.status(403).json({ message: 'Accès interdit, rôle insuffisant' });
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
  };
};
