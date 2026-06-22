import { AuthRequest } from "@middleware/auth";
import { Response } from "express";
import User from "@models/User";
import { hashPassword, comparePassword } from "@utils/password";
import { generateToken } from "@utils/jwt";
import { sendSuccess, sendError } from "@utils/response";
import { asyncHandler } from "@utils/errorHandler";

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password, nama_lengkap, no_hp } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    sendError(res, "User already exists", "USER_EXISTS", 409);
    return;
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create new user
  const user = await User.create({
    email,
    password: hashedPassword,
    nama_lengkap,
    no_hp,
    level: 1,
    points: 0,
    role: "user",
    isMentor: false,
  });

  // Generate token
  const token = generateToken({
    id: user.id.toString(),
    email: user.email,
    role: user.role,
  });

  sendSuccess(
    res,
    "User registered successfully",
    {
      id: user.id,
      email: user.email,
      nama_lengkap: user.nama_lengkap,
      token,
    },
    201
  );
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    sendError(res, "Invalid email or password", "INVALID_CREDENTIALS", 401);
    return;
  }

  // Compare passwords
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    sendError(res, "Invalid email or password", "INVALID_CREDENTIALS", 401);
    return;
  }

  // Generate token
  const token = generateToken({
    id: user.id.toString(),
    email: user.email,
    role: user.role,
  });

  sendSuccess(res, "Login successful", {
    id: user.id,
    email: user.email,
    nama_lengkap: user.nama_lengkap,
    token,
  });
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Token is handled on client side, just send success response
  sendSuccess(res, "Logout successful");
});

export default {
  register,
  login,
  logout,
};
