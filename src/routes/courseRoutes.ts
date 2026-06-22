import { Router } from "express";
import { body } from "express-validator";
import * as courseController from "@controllers/courseController";
import { authenticateToken } from "@middleware/auth";
import { validationMiddleware } from "@middleware/validation";

const router = Router();

// Get all courses (public)
router.get("/", courseController.getAllCourses);

// Get course detail (public)
router.get("/:courseId", courseController.getCourseDetail);

// Get module detail (public)
router.get("/:courseId/modules/:moduleId", courseController.getModuleDetail);

// Protected routes
router.use(authenticateToken);

// Get course progress
router.get("/:courseId/progress", courseController.getCourseProgress);

// Mark lesson as completed
router.post(
  "/:courseId/lessons/:lessonId/complete",
  courseController.markLessonComplete
);

export default router;
