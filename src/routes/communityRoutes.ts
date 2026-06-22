import { Router } from "express";
import { body } from "express-validator";
import * as communityController from "@controllers/communityController";
import { authenticateToken } from "@middleware/auth";
import { validationMiddleware } from "@middleware/validation";

const router = Router();

// Get all threads (public)
router.get("/threads", communityController.getAllThreads);

// Get thread detail (public)
router.get("/threads/:threadId", communityController.getThreadDetail);

// Protected routes
router.use(authenticateToken);

// Create thread
router.post(
  "/threads",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content is required"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  validationMiddleware,
  communityController.createThread
);

// Reply to thread
router.post(
  "/threads/:threadId/replies",
  [body("content").notEmpty().withMessage("Content is required")],
  validationMiddleware,
  communityController.replyToThread
);

// Like thread
router.post("/threads/:threadId/like", communityController.likeThread);

// Delete thread
router.delete("/threads/:threadId", communityController.deleteThread);

export default router;
