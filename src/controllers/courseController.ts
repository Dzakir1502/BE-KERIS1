import { AuthRequest } from "@middleware/auth";
import { Response } from "express";
import Course from "@models/Course";
import Module from "@models/Module";
import { CourseEnrollment } from "@models/Enrollment";
import User from "@models/User";
import { sendSuccess, sendError } from "@utils/response";
import { asyncHandler } from "@utils/errorHandler";
import { Op } from "sequelize";

export const getAllCourses = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 10, category, level, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (category) where.category = category;
    if (level) where.level = level;
    if (search)
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];

    const { count, rows } = await Course.findAndCountAll({
      where,
      // PERBAIKAN DI SINI: Menghapus as: "instructor" agar sesuai dengan definisi Model
      include: [{ model: User, attributes: ["id", "nama_lengkap"] }],
      offset,
      limit: Number(limit),
    });

    sendSuccess(res, "Courses retrieved successfully", {
      data: rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
      },
    });
  }
);

export const getCourseDetail = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params;

    const course = await Course.findByPk(courseId, {
      include: [
        { model: User, attributes: ["id", "nama_lengkap", "avatar"] },
        { model: Module, attributes: ["id", "title", "description", "order", "lessons"] },
      ],
    });

    if (!course) {
      sendError(res, "Course not found", "COURSE_NOT_FOUND", 404);
      return;
    }

    sendSuccess(res, "Course detail retrieved successfully", course);
  }
);

export const getModuleDetail = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { courseId, moduleId } = req.params;

    const module = await Module.findByPk(moduleId);
    if (!module || module.courseId !== Number(courseId)) {
      sendError(res, "Module not found", "MODULE_NOT_FOUND", 404);
      return;
    }

    sendSuccess(res, "Module detail retrieved successfully", module);
  }
);

export const getCourseProgress = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { courseId } = req.params;

    const enrollment = await CourseEnrollment.findOne({
      where: { userId, courseId },
    });

    if (!enrollment) {
      sendError(
        res,
        "User not enrolled in this course",
        "NOT_ENROLLED",
        404
      );
      return;
    }

    sendSuccess(res, "Course progress retrieved successfully", {
      courseId,
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons,
      completedModules: enrollment.completedModules,
      enrolledDate: enrollment.enrolledDate,
    });
  }
);

export const markLessonComplete = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { courseId, lessonId } = req.params;

    const enrollment = await CourseEnrollment.findOne({
      where: { userId, courseId },
    });

    if (!enrollment) {
      sendError(
        res,
        "User not enrolled in this course",
        "NOT_ENROLLED",
        404
      );
      return;
    }

    // Add lesson to completed lessons
    const completedLessons: string[] = Array.isArray(enrollment.completedLessons)
      ? (enrollment.completedLessons as unknown as string[])
      : [];

    const lessonIdStr = String(lessonId);

    if (!completedLessons.includes(lessonIdStr)) {
      completedLessons.push(lessonIdStr);
      enrollment.completedLessons = JSON.stringify(completedLessons);
      await enrollment.save();
    }

    sendSuccess(res, "Lesson marked as completed", {
      lessonId,
      completed: true,
      pointsEarned: 10,
    });
  }
);

export default {
  getAllCourses,
  getCourseDetail,
  getModuleDetail,
  getCourseProgress,
  markLessonComplete,
};