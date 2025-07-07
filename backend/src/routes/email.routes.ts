import express from 'express';
import  * as emailController from '../controllers/email.controller';
import { checkRole } from '../middlewares/user.middleware';


const emailRouter = express.Router();

emailRouter.post('/admin/sendemail', checkRole("Admin"), emailController.handleSendEmail);
emailRouter.post('/admin/previewemail', checkRole("Admin"), emailController.handlePreviewEmail);

export default emailRouter;