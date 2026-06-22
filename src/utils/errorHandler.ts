import { Request, Response, NextFunction } from "express";
import { sendError } from "@utils/response";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public error?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Error:", err);

  if (err instanceof AppError) {
    sendError(res, err.message, err.error, err.statusCode);
    return;
  }

  if (err instanceof SyntaxError && "body" in err) {
    sendError(res, "Invalid JSON", "INVALID_JSON", 400);
    return;
  }

  sendError(
    res,
    "Internal Server Error",
    "INTERNAL_SERVER_ERROR",
    500
  );
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
