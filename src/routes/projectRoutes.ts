import { Router } from "express";
import { body } from "express-validator";
import * as projectController from "@controllers/projectController";
import { authenticateToken } from "@middleware/auth";
import { validationMiddleware } from "@middleware/validation";

const router = Router();

// Get all projects (public)
router.get("/", projectController.getAllProjects);

// Get all submissions for the authenticated user (must be before /:projectId)
router.get("/my-submissions", authenticateToken, projectController.getMySubmissions);

// Get project detail (public)
router.get("/:projectId", projectController.getProjectDetail);

// Protected routes
router.use(authenticateToken);

// Submit project
router.post(
  "/:projectId/submit",
  [
    body("projectLink").isURL().withMessage("Invalid project link"),
    body("demoLink").isURL().withMessage("Invalid demo link"),
    body("description").notEmpty().withMessage("Description is required"),
  ],
  validationMiddleware,
  projectController.submitProject
);

// Get user submission
router.get("/:projectId/submission", projectController.getUserSubmission);

export default router;
