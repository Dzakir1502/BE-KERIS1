import { AuthRequest } from "@middleware/auth";
import { Response } from "express";
import User from "@models/User";
import { CourseEnrollment, Enrollment } from "@models/Enrollment";
import Submission from "@models/Submission";
import { Thread } from "@models/Community";
import { sendSuccess, sendError } from "@utils/response";
import { asyncHandler } from "@utils/errorHandler";

export const getDashboard = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    const user = await User.findByPk(userId);
    if (!user) {
      sendError(res, "User not found", "USER_NOT_FOUND", 404);
      return;
    }

    // Get stats
    const coursesEnrolled = await CourseEnrollment.count({
      where: { userId },
    });

    const coursesCompleted = await CourseEnrollment.count({
      where: { userId, status: "completed" },
    });

    const projectsSubmitted = await Submission.count({
      where: { userId },
    });

    const projectsApproved = await Submission.count({
      where: { userId, status: "approved" },
    });

    const threadsCreated = await Thread.count({
      where: { authorId: userId },
    });

    const enrollments = await Enrollment.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    sendSuccess(res, "Dashboard retrieved successfully", {
      user: {
        id: user.id,
        name: user.nama_lengkap,
        level: user.level,
        points: user.points,
      },
      stats: {
        coursesEnrolled,
        coursesCompleted,
        projectsSubmitted,
        projectsApproved,
        threadsCreated,
        mentorSessions: 0,
      },
      enrollments,
      recentActivity: [],
      upcomingMentorSessions: [],
    });
  }
);

export default {
  getDashboard,
};
