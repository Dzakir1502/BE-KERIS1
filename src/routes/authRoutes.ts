import { Router } from "express";
import { body } from "express-validator";
import * as authController from "@controllers/authController";
import { validationMiddleware } from "@middleware/validation";

const router = Router();

// Register
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("nama_lengkap").notEmpty().withMessage("Full name is required"),
    body("no_hp").notEmpty().withMessage("Phone number is required"),
  ],
  validationMiddleware,
  authController.register
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validationMiddleware,
  authController.login
);

// Logout
router.post("/logout", authController.logout);

export default router;
