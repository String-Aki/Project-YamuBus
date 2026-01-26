import express from 'express';
import { 
    loginAdmin, 
    getManagers, 
    updateManagerStatus 
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authAdminMiddleware.js';

const router = express.Router();
router.post('/login', loginAdmin);

router.get('/managers', protectAdmin, getManagers);

router.put('/managers/:id/status', protectAdmin, updateManagerStatus);

export default router;