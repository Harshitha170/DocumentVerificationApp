import { Router} from "express";
import { getPendingDocuments,
        updateDocumentStatus
 } from "../controllers/document.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";


const router = Router();

router.get('/pendingDocuments',verifyJWT, verifyAdmin, getPendingDocuments);
router.patch('/document/:documentId/status', verifyJWT, verifyAdmin, updateDocumentStatus )
export default router;