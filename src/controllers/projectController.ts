import { AuthRequest } from "@middleware/auth";
import { Response } from "express";
import Project from "@models/Project";
import Submission from "@models/Submission";
import User from "@models/User";
import { sendSuccess, sendError } from "@utils/response";
import { asyncHandler } from "@utils/errorHandler";
import { Op } from "sequelize";

export const getAllProjects = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 10, difficulty, category, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (difficulty) where.difficulty = difficulty;
    if (category) where.category = category;
    if (status) where.status = status;

    const { count, rows } = await Project.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
    });

    sendSuccess(res, "Projects retrieved successfully", {
      data: rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
      },
    });
  }
);

export const getProjectDetail = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const projectId = Number(req.params.projectId);
    if (Number.isNaN(projectId)) {
      sendError(res, "Invalid project ID", "INVALID_PROJECT_ID", 400);
      return;
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      sendError(res, "Project not found", "PROJECT_NOT_FOUND", 404);
      return;
    }

    sendSuccess(res, "Project detail retrieved successfully", project);
  }
);

export const submitProject = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const projectId = Number(req.params.projectId);
    const { projectLink, demoLink, description, technologies } = req.body;

    if (Number.isNaN(projectId)) {
      sendError(res, "Invalid project ID", "INVALID_PROJECT_ID", 400);
      return;
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      sendError(res, "Project not found", "PROJECT_NOT_FOUND", 404);
      return;
    }

    // Check if user already submitted
    const existingSubmission = await Submission.findOne({
      where: { projectId, userId },
    });

    if (existingSubmission) {
      sendError(res, "You already submitted this project", "ALREADY_SUBMITTED", 409);
      return;
    }

    const submission = await Submission.create({
      projectId,
      userId: Number(userId),
      projectLink,
      demoLink,
      description,
      technologies: JSON.stringify(technologies),
    });

    sendSuccess(res, "Submission created", {
      submissionId: submission.id,
      projectId: submission.projectId,
      userId: submission.userId,
      status: submission.status,
      submittedAt: submission.submittedAt,
    }, 201);
  }
);

export const getUserSubmission = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const projectId = Number(req.params.projectId);

    if (Number.isNaN(projectId)) {
      sendError(res, "Invalid project ID", "INVALID_PROJECT_ID", 400);
      return;
    }

    const submission = await Submission.findOne({
      where: { projectId, userId },
    });

    if (!submission) {
      sendError(res, "Submission not found", "SUBMISSION_NOT_FOUND", 404);
      return;
    }

    sendSuccess(res, "Submission retrieved successfully", {
      submissionId: submission.id,
      projectId: submission.projectId,
      userId: submission.userId,
      projectLink: submission.projectLink,
      demoLink: submission.demoLink,
      status: submission.status,
      feedback: submission.feedback,
      score: submission.score,
      submittedAt: submission.submittedAt,
      reviewedAt: submission.reviewedAt,
    });
  }
);

export const getMySubmissions = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    const submissions = await Submission.findAll({
      where: { userId },
      include: [
        {
          model: Project,
          attributes: ["id", "title", "category", "difficulty"],
        },
      ],
      order: [["submittedAt", "DESC"]],
    });

    sendSuccess(res, "Submissions retrieved successfully", submissions);
  }
);

export default {
  getAllProjects,
  getProjectDetail,
  submitProject,
  getUserSubmission,
  getMySubmissions,
};
