import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

interface AppError extends Error {
  status?: number;
  code?: string;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const code = err.code || "INTERNAL_SERVER_ERROR";

  logger.error(`Error: ${message}`, {
    status,
    code,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(status).json({
    error: {
      message,
      code,
      status
    }
  });
};
