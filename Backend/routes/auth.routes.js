import {Router} from 'express'
import { registerUser,
    loginUser,
    uploadDocuments
} from '../controllers/authController.js'
import upload from '../middlewares/multer.middlewares.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser )

router.route('/upload').post(
    verifyJWT,
    upload.fields([
        {
            name: "Aadhar",
            maxCount: 1
        },
        {
            name: "Pan",
            maxCount: 1
        },
        {
            name: "DL",
            maxCount: 1
        }
    ]),  uploadDocuments
)
export default router;