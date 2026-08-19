import express from 'express';
import * as imexportController from '../controllers/im_export.controller';
import { createUploadMiddleware } from '../middlewares/multer.middleware';
import { checkRole } from '../middlewares/user.middleware';

const uploadMiddleware = createUploadMiddleware();
const imexportRouter = express.Router();

imexportRouter.post(
    '/admin/import/:category/:item',
    checkRole('Admin', []),
    uploadMiddleware.multerUpload.single('file'),
    uploadMiddleware.verifyAndSave,
    imexportController.updateFoodMenu,
);

imexportRouter.post('/admin/exportgsheet', checkRole('Admin', []), imexportController.exportAllDataToSheets);
imexportRouter.get('/admin/exportbus', checkRole('Admin', []), imexportController.exportUsersCSV);
imexportRouter.get('/admin/exportteammembers', checkRole('Admin', []), imexportController.exportTeamMembersCSV);
imexportRouter.get(
    '/admin/document/:category/:item',
    checkRole('Admin', []),
    imexportController.getUploadedDocumentStatus,
);
imexportRouter.delete('/admin/document/:category/:item', checkRole('Admin', []), imexportController.deleteDocument);

export default imexportRouter;
