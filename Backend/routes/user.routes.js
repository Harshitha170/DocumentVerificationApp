import { Router } from 'express';
import { getCurrentUser } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js'; 

const router = Router();

// Route: GET /api/users/me
router.route('/me').get(verifyJWT, getCurrentUser);

export default router;