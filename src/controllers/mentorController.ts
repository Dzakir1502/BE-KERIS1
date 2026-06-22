import { AuthRequest } from "@middleware/auth";
import { Response } from "express";
import Mentor from "@models/Mentor";
import { Enrollment } from "@models/Enrollment";
import User from "@models/User";
import { sendSuccess, sendError } from "@utils/response";
import { asyncHandler } from "@utils/errorHandler";
import { Op } from "sequelize";

export const getAllMentors = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 10, specialty, rating } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where: any = { isActive: true };
    if (specialty) where.specialty = specialty;
    if (rating) where.rating = { [Op.gte]: Number(rating) };

    const { count, rows } = await Mentor.findAndCountAll({
      where,
      include: [{ model: User, attributes: ["id", "nama_lengkap", "avatar"] }],
      offset,
      limit: Number(limit),
    });

    sendSuccess(res, "Mentors retrieved successfully", {
      data: rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
      },
    });
  }
);

export const getMentorDetail = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { mentorId } = req.params;

    const mentor = await Mentor.findByPk(mentorId, {
      include: [{ model: User, attributes: ["id", "nama_lengkap", "avatar", "bio"] }],
    });

    if (!mentor) {
      sendError(res, "Mentor not found", "MENTOR_NOT_FOUND", 404);
      return;
    }

    sendSuccess(res, "Mentor detail retrieved successfully", mentor);
  }
);

export const enrollTrack = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { mentorId, trackName, duration } = req.body;

    const mentor = await Mentor.findByPk(mentorId);
    if (!mentor) {
      sendError(res, "Mentor not found", "MENTOR_NOT_FOUND", 404);
      return;
    }

    // Calculate end date
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + duration * 7 * 24 * 60 * 60 * 1000); // weeks to milliseconds

    const enrollment = await Enrollment.create({
      userId: Number(userId),
      mentorId,
      trackName,
      duration,
      startDate,
      endDate,
      status: "active",
      progress: 0
    });

    sendSuccess(res, "Enrolled successfully", {
      enrollmentId: enrollment.id,
      userId: enrollment.userId,
      mentorId: enrollment.mentorId,
      trackName: enrollment.trackName,
      status: enrollment.status,
      startDate: enrollment.startDate,
      endDate: enrollment.endDate,
    }, 201);
  }
);

export const contactMentor = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { mentorId } = req.params;
    const { message, meetingType } = req.body;

    const mentor = await Mentor.findByPk(mentorId);
    if (!mentor) {
      sendError(res, "Mentor not found", "MENTOR_NOT_FOUND", 404);
      return;
    }

    // In a real app, this would create a contact request or message
    // For now, we'll just return success
    sendSuccess(res, "Message sent to mentor", {
      contactId: Math.floor(Math.random() * 1000),
      status: "pending",
      createdAt: new Date(),
    }, 201);
  }
);

export default {
  getAllMentors,
  getMentorDetail,
  enrollTrack,
  contactMentor,
};
