import express from 'express';
import  * as emailController from '../controllers/email.controller';
import { checkRole } from '../middlewares/user.middleware';


const emailRouter = express.Router();

emailRouter.post('/sendemail', checkRole("Admin"), emailController.handleSendEmail);
emailRouter.post('/previewemail', checkRole("Admin"), emailController.handlePreviewEmail);

export default emailRouter;