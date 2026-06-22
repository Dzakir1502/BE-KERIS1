import { Router } from "express";
import { body } from "express-validator";
import * as enrollmentCodeController from "@controllers/enrollmentCodeController";
import { authenticateToken } from "@middleware/auth";
import { validationMiddleware } from "@middleware/validation";

const router = Router();

// Protected routes
router.use(authenticateToken);

// Generate a new code (Admin / Chatbot only)
// Normally you'd add role validation here to ensure only admin/system can generate codes
router.post(
  "/generate",
  [
    body("trackName")
      .notEmpty().withMessage("Track name is required")
      .isIn(["Web Development", "Mobile Development", "Artificial Intelligence"]).withMessage("Track name must be either 'Web Development', 'Mobile Development', or 'Artificial Intelligence'"),
  ],
  validationMiddleware,
  enrollmentCodeController.generateCode
);

// Validate a code without redeeming it
router.post(
  "/validate",
  [
    body("code").notEmpty().withMessage("Code is required"),
  ],
  validationMiddleware,
  enrollmentCodeController.validateCode
);

// Redeem a code and enroll the user
router.post(
  "/redeem",
  [
    body("code").notEmpty().withMessage("Code is required"),
    body("duration").optional().isInt({ min: 1 }).withMessage("Duration must be at least 1 week"),
  ],
  validationMiddleware,
  enrollmentCodeController.redeemCode
);

export default router;
