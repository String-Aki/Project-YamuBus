import express from 'express';
import { createRoute } from '../controllers/routeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createRoute);

export default router;