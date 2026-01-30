import express from 'express';
import { getBusById } from '../controllers/busController.js';

const router = express.Router();

router.get('/:id', getBusById);

export default router;