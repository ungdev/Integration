import express from 'express';
import * as userController from '../controllers/user.controller';
import { authenticateUser } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/user.middleware';

const userRouter = express.Router();


userRouter.get('/user/getusers', checkRole("Student"), userController.getUsers);


userRouter.get('/admin/getusersbypermission', checkRole("Admin"), userController.getUsersByPermission);
userRouter.post('/user/syncnewstudent', checkRole("Admin"), userController.syncNewstudent);



export default userRouter;
