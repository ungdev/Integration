import express from 'express';
import * as userController from '../controllers/user.controller';
import { authenticateUser } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/user.middleware';

const userRouter = express.Router();

// Admin routes
userRouter.get('/admin/getusersbypermission', checkRole("Admin"), userController.getUsersByPermission);
userRouter.patch('/admin/user/:userId', checkRole("Admin"), userController.adminUpdateUser);
userRouter.delete('/admin/user/:userId', checkRole("Admin"), userController.adminDeleteUser);


// User routes
userRouter.get('/user/getusers', checkRole("Student"), userController.getUsers);
userRouter.post('/user/syncnewstudent', checkRole("Admin"), userController.syncNewstudent);
userRouter.patch('/user/profile', authenticateUser, userController.updateProfile);
userRouter.get('/user/me', authenticateUser, userController.getCurrentUser);





export default userRouter;
