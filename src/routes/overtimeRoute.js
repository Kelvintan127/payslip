import express from 'express';
import OvertimeController from '../controllers/overtimeController.js';
import { roleAuthMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/submit', roleAuthMiddleware('employee'), OvertimeController.submitOvertime);

export default router;