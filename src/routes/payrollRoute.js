import express from "express";
import payrollController from "../controllers/payrollController.js";
import { roleAuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/run", roleAuthMiddleware('admin'), payrollController.runPayroll);

export default router;