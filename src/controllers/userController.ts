import { AuthRequest } from "@middleware/auth";
import { Response } from "express";
import User from "@models/User";
import { hashPassword, comparePassword } from "@utils/password";
import { sendSuccess, sendError } from "@utils/response";
import { asyncHandler } from "@utils/errorHandler";

export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    const user = await User.findByPk(userId);
    if (!user) {
      sendError(res, "User not found", "USER_NOT_FOUND", 404);
      return;
    }

    sendSuccess(res, "Profile retrieved successfully", {
      id: user.id,
      email: user.email,
      nama_lengkap: user.nama_lengkap,
      no_hp: user.no_hp,
      bio: user.bio,
      avatar: user.avatar,
      level: user.level,
      points: user.points,
      createdAt: user.createdAt,
    });
  }
);

export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { nama_lengkap, no_hp, bio, avatar } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      sendError(res, "User not found", "USER_NOT_FOUND", 404);
      return;
    }

    // Update fields
    if (nama_lengkap) user.nama_lengkap = nama_lengkap;
    if (no_hp) user.no_hp = no_hp;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();

    sendSuccess(res, "Profile updated successfully", {
      id: user.id,
      email: user.email,
      nama_lengkap: user.nama_lengkap,
      no_hp: user.no_hp,
      bio: user.bio,
      avatar: user.avatar,
      level: user.level,
      points: user.points,
    });
  }
);

export const changePassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      sendError(res, "User not found", "USER_NOT_FOUND", 404);
      return;
    }

    // Verify old password
    const isPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
      sendError(res, "Old password is incorrect", "INVALID_PASSWORD", 401);
      return;
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;

    await user.save();

    sendSuccess(res, "Password changed successfully");
  }
);

export default {
  getProfile,
  updateProfile,
  changePassword,
};
