import { AuthRequest } from "@middleware/auth";
import { Response } from "express";
import EnrollmentCode from "@models/EnrollmentCode";
import { Enrollment } from "@models/Enrollment";
import { sendSuccess, sendError } from "@utils/response";
import { asyncHandler } from "@utils/errorHandler";
import crypto from "crypto";

export const generateCode = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { trackName } = req.body;

    // Generate a random 8-character code
    const randomString = crypto.randomBytes(4).toString("hex").toUpperCase();
    const code = `KRS-${randomString}`;

    const enrollmentCode = await EnrollmentCode.create({
      code,
      trackName,
      isUsed: false,
    });

    sendSuccess(res, "Enrollment code generated successfully", {
      code: enrollmentCode.code,
      trackName: enrollmentCode.trackName,
    }, 201);
  }
);

export const validateCode = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { code } = req.body;

    const enrollmentCode = await EnrollmentCode.findOne({
      where: { code, isUsed: false },
    });

    if (!enrollmentCode) {
      sendError(res, "Invalid or already used enrollment code", "INVALID_CODE", 400);
      return;
    }

    sendSuccess(res, "Enrollment code is valid", {
      code: enrollmentCode.code,
      trackName: enrollmentCode.trackName,
    });
  }
);

export const redeemCode = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { code, duration } = req.body;

    // Validate the code again and lock it for update if transaction was used (omitted for simplicity)
    const enrollmentCode = await EnrollmentCode.findOne({
      where: { code, isUsed: false },
    });

    if (!enrollmentCode) {
      sendError(res, "Invalid or already used enrollment code", "INVALID_CODE", 400);
      return;
    }

    // Mark as used
    enrollmentCode.isUsed = true;
    enrollmentCode.usedByUserId = Number(userId);
    enrollmentCode.usedAt = new Date();
    await enrollmentCode.save();

    // Create the enrollment for the user
    const startDate = new Date();
    // Default duration is 4 weeks if not provided
    const durationWeeks = duration ? Number(duration) : 4;
    const endDate = new Date(startDate.getTime() + durationWeeks * 7 * 24 * 60 * 60 * 1000);

    const enrollment = await Enrollment.create({
      userId: Number(userId),
      mentorId: null, // No mentor
      trackName: enrollmentCode.trackName,
      duration: durationWeeks,
      startDate,
      endDate,
      status: "active",
      progress: 0
    });

    sendSuccess(res, "Enrolled successfully", {
      enrollmentId: enrollment.id,
      userId: enrollment.userId,
      trackName: enrollment.trackName,
      status: enrollment.status,
      startDate: enrollment.startDate,
      endDate: enrollment.endDate,
    }, 201);
  }
);

export default {
  generateCode,
  validateCode,
  redeemCode,
};
