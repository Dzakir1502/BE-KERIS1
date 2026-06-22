import { Response } from "express";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export const sendSuccess = <T = any>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  } as ApiResponse<T>);
};

export const sendError = (
  res: Response,
  message: string,
  error?: string,
  statusCode: number = 400
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  } as ApiResponse);
};

export default {
  sendSuccess,
  sendError,
};
