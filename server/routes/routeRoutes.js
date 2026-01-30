import express from 'express';
import { createRoute, getRoutes, deleteRoute } from '../controllers/routeController.js';
import { protectAdmin } from '../middleware/authAdminMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protectAdmin, createRoute)
    .get(protectAdmin, getRoutes);

router.route('/:id').delete(protectAdmin, deleteRoute);

export default router;