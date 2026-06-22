import jwt from "jsonwebtoken";
import { config } from "@config/env";

interface TokenPayload {
  id: string;
  email: string;
  role?: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.JWT_SECRET as string, {
    expiresIn: config.JWT_EXPIRY,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, config.JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export default {
  generateToken,
  verifyToken,
  decodeToken,
};
