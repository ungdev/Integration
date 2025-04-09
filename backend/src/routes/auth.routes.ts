import express from 'express';
import * as authController from '../controllers/auth.controller';

const authRouter = express.Router();

// Route d'inscription
authRouter.post('/register', authController.register);
authRouter.post("/completeregistration", authController.completeRegistration);
authRouter.get('/handlecasticket', authController.handlecasticket)

// Route de connexion
authRouter.post('/login', authController.login);
authRouter.get("/istokenvalid", authController.isTokenValid);
authRouter.post('/resetpassworduser', authController.resetPasswordUser)
authRouter.post('/requestpassworduser', authController.requestPasswordUser)

export default authRouter;
