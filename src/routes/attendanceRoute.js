import express from "express";
import attendanceController from "../controllers/attendanceController.js";
import { roleAuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", roleAuthMiddleware('admin'), attendanceController.createAttendancePeriod);
router.post("/submit", roleAuthMiddleware('employee'), attendanceController.submitAttendance);

export default router;