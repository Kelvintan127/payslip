import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/admin/login", authController.adminLogin);
router.post("/employee/login", authController.employeeLogin);

export default router;