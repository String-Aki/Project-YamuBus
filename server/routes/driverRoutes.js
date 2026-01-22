import express from 'express';
import { loginDriver } from '../controllers/driverController.js';

const router = express.Router();

router.post('/login', loginDriver);

export default router;