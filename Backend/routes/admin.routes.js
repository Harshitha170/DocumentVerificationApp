import express from 'express';
import { getPendingDocuments, updateDocumentStatus } from '../controllers/admin.controller.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js'; 

const router = express.Router();

// Apply JWT and Admin verification guards to all admin routes
router.use(verifyJWT, verifyAdmin);

router.get('/documents', getPendingDocuments);
router.patch('/documents/:documentId', updateDocumentStatus);

export default router;