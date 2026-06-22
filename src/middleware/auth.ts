import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@utils/jwt";
import { sendError } from "@utils/response";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    sendError(res, "No token provided", "UNAUTHORIZED", 401);
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    sendError(res, "Invalid or expired token", "UNAUTHORIZED", 401);
  }
};

export const authorizeRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, "User not authenticated", "UNAUTHORIZED", 401);
      return;
    }

    if (!roles.includes(req.user.role || "")) {
      sendError(
        res,
        "You don't have permission to access this resource",
        "FORBIDDEN",
        403
      );
      return;
    }

    next();
  };
};
