import { Router } from "express";
import { body } from "express-validator";
import * as mentorController from "@controllers/mentorController";
import { authenticateToken } from "@middleware/auth";
import { validationMiddleware } from "@middleware/validation";

const router = Router();

// Get all mentors (public)
router.get("/", mentorController.getAllMentors);

// Get mentor detail (public)
router.get("/:mentorId", mentorController.getMentorDetail);

// Protected routes
router.use(authenticateToken);

// Enroll in track
router.post(
  "/enroll-track",
  [
    body("mentorId").isInt().withMessage("Mentor ID must be an integer"),
    body("trackName").notEmpty().withMessage("Track name is required"),
    body("duration").isInt({ min: 1 }).withMessage("Duration must be at least 1 week"),
  ],
  validationMiddleware,
  mentorController.enrollTrack
);

// Contact mentor
router.post(
  "/:mentorId/contact",
  [
    body("message").notEmpty().withMessage("Message is required"),
    body("meetingType").isIn(["video_call", "chat"]).withMessage("Invalid meeting type"),
  ],
  validationMiddleware,
  mentorController.contactMentor
);

export default router;
