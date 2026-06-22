import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { sendError } from "@utils/response";

export const validationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((err) => `${(err as any).path || (err as any).param}: ${err.msg}`)
      .join(", ");

    sendError(res, errorMessages, "VALIDATION_ERROR", 400);
    return;
  }

  next();
};
