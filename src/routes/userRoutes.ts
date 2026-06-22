import { Router } from "express";
import { body } from "express-validator";
import * as userController from "@controllers/userController";
import { authenticateToken } from "@middleware/auth";
import { validationMiddleware } from "@middleware/validation";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get profile
router.get("/profile", userController.getProfile);

// Update profile
router.put(
  "/profile",
  [
    body("nama_lengkap").optional().isString().withMessage("Full name must be a string"),
    body("no_hp").optional().isString().withMessage("Phone number must be a string"),
  ],
  validationMiddleware,
  userController.updateProfile
);

// Change password
router.put(
  "/change-password",
  [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  ],
  validationMiddleware,
  userController.changePassword
);

export default router;
