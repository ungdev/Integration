import express from 'express';
import * as userController from '../controllers/user.controller';
import { checkRole } from '../middlewares/user.middleware';

const userRouter = express.Router();

// Admin routes
userRouter.get('/admin/getusersbypermission', checkRole('Admin', []), userController.getUsersByPermission);
userRouter.patch('/admin/user/:userId', checkRole('Admin', []), userController.adminUpdateUser);
userRouter.delete('/admin/user/:userId', checkRole('Admin', []), userController.adminDeleteUser);
userRouter.get(
    '/admin/getusercontactinformation/:userId',
    checkRole('Admin', []),
    userController.getUserContactInformation,
);
userRouter.post('/admin/user', checkRole('Admin', []), userController.adminCreateUser);
userRouter.get('/admin/getusers', checkRole('Admin', ['Respo CE']), userController.getUsersAdmin);
userRouter.post('/admin/syncnewstudent', checkRole('Admin', []), userController.syncNewstudent);

// User routes
userRouter.patch('/user/me', userController.updateProfile);
userRouter.get('/user/me', userController.getCurrentUser);
userRouter.get('/user/getusers', userController.getUsers);
userRouter.post('/user/usercontactinformation', userController.createUserContactInformation);
userRouter.get('/onboarding-status', userController.getCurrentUserOnboardingStatus);
userRouter.get('/vss/questionnaire', userController.getVssQuestionnaire);
userRouter.post('/vss/questionnaire', userController.submitVssQuestionnaire);

export default userRouter;
