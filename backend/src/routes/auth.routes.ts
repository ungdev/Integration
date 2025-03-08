import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const authRouter = Router();

// Route d'inscription
authRouter.post('/register', authController.register);

// Route de connexion
authRouter.post('/login', authController.login);

export default authRouter;
