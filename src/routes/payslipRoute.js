import payslipController from "../controllers/payslipController.js";
import { roleAuthMiddleware } from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.get("/:payrollId", roleAuthMiddleware('employee'), payslipController.generatePayslip);
router.get("/summary/:payrollId", roleAuthMiddleware('admin'), payslipController.generateSummaryPayslip);

export default router;