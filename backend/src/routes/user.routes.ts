import express from 'express';
import * as userController from '../controllers/user.controller';
import { authenticateUser } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/user.middleware';

const userRouter = express.Router();


userRouter.get('/getusers', authenticateUser, checkRole("admin"),userController.getUsers)



export default userRouter;
