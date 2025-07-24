import express from 'express';
import * as userController from '../controllers/user.controller';
import { authenticateUser } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/user.middleware';

const userRouter = express.Router();

// Admin routes
userRouter.get('/admin/getusersbypermission', checkRole("Admin",[]), userController.getUsersByPermission);
userRouter.patch('/admin/user/:userId', checkRole("Admin",[]), userController.adminUpdateUser);
userRouter.delete('/admin/user/:userId', checkRole("Admin",[]), userController.adminDeleteUser);
userRouter.get('/admin/getusers', checkRole("Admin",[]), userController.getUsersAdmin);
userRouter.post('/admin/syncnewstudent', checkRole("Admin",[]), userController.syncNewstudent);


// User routes
userRouter.patch('/user/me', authenticateUser, userController.updateProfile);
userRouter.get('/user/me', authenticateUser, userController.getCurrentUser);
userRouter.get('/user/getusers', checkRole("Student",[]), userController.getUsers);





export default userRouter;
