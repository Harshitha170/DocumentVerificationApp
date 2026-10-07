// src/routes/document.routes.js
import { Router } from 'express';
import { uploadDocuments } from '../controllers/authController.js';
import upload from '../middlewares/multer.middlewares.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { Document } from '../models/document.model.js';
const router = Router();

// POST upload single document
router.route('/upload').post(
    verifyJWT,
    upload.single('file'),
    uploadDocuments
);

// GET user's uploaded documents
router.get('/me', verifyJWT, async (req, res) => {
    try {
        const userId = req.user.userId;
        const documents = await Document.find({ userId });
        return res.status(200).json(documents);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching documents", error: error.message });
    }
});

export default router;