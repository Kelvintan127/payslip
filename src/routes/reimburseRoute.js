import express from "express";
import reimburseController from "../controllers/reimburseController.js";
import { roleAuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/submit", roleAuthMiddleware('employee'), reimburseController.submitReimburse);

export default router;