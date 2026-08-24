import express from 'express';
import multer from 'multer';
import * as permanenceController from '../controllers/permanence.controller';
import { isRespoMiddleware } from '../middlewares/respoperm.middleware';
import { checkRole } from '../middlewares/user.middleware';

const permanenceRouter = express.Router();
const upload = multer({ dest: 'uploads/permcsv/' });

// Admin routes
permanenceRouter.post('/admin/permanence', checkRole('Admin', ['Respo CE']), permanenceController.createPermanence);
permanenceRouter.delete('/admin/permanence', checkRole('Admin', ['Respo CE']), permanenceController.deletePermanence);
permanenceRouter.post(
    '/admin/updatepermanence',
    checkRole('Admin', ['Respo CE']),
    permanenceController.updatePermanence,
);
permanenceRouter.post('/admin/open', checkRole('Admin', ['Respo CE']), permanenceController.openPermanence);
permanenceRouter.post('/admin/close', checkRole('Admin', ['Respo CE']), permanenceController.closePermanence);
permanenceRouter.get('/admin/permanences', checkRole('Admin', ['Respo CE']), permanenceController.getAllPermanences);
permanenceRouter.get('/admin/users', checkRole('Admin', ['Respo CE']), permanenceController.getUsersInPermanence);
permanenceRouter.post('/admin/add', checkRole('Admin', ['Respo CE']), permanenceController.addUserToPermanence);
permanenceRouter.post('/admin/remove', checkRole('Admin', ['Respo CE']), permanenceController.removeUserToPermanence);
permanenceRouter.post(
    '/admin/importpermanences',
    checkRole('Admin', ['Respo CE']),
    upload.single('file'),
    permanenceController.uploadPermanencesCSV,
);
permanenceRouter.post('/admin/claimedmember', checkRole('Admin', ['Respo CE']), permanenceController.claimMember);

//Respo de perm routes
permanenceRouter.get('/respo/respodetails', isRespoMiddleware, permanenceController.getRespoPermanencesWithMembers);
permanenceRouter.post('/respo/claimedmember', isRespoMiddleware, permanenceController.claimMember);

// Student routes
permanenceRouter.get('/user/permanences', checkRole('Student', []), permanenceController.getOpenPermanences);
permanenceRouter.get(
    '/user/concurrent/status',
    checkRole('Student', []),
    permanenceController.getConcurrentPermanences,
);
permanenceRouter.post('/user/apply', checkRole('Student', []), permanenceController.applyToPermanence);
permanenceRouter.post('/user/leave', checkRole('Student', []), permanenceController.leavePermanence);
permanenceRouter.get('/user/me', checkRole('Student', []), permanenceController.getMyPermanences);
permanenceRouter.get('/user/isrespo', permanenceController.isUserRespo);
export default permanenceRouter;
