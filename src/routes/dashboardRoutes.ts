import { Router } from "express";
import * as dashboardController from "@controllers/dashboardController";
import { authenticateToken } from "@middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get dashboard overview
router.get("/", dashboardController.getDashboard);

export default router;
