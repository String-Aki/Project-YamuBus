import express from 'express';
import { startTrip, endTrip } from '../controllers/tripcontroller.js';
import { protect, protectDriver } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/start', protectDriver, startTrip);
router.post('/end', protectDriver, endTrip);

export default router;