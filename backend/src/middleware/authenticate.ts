import type { Request, Response, NextFunction } from "express";

import { redis } from "../lib/redis.js";
import { hashSessionId } from "../utils/session.js";
import { AppError } from "../utils/app-error.js";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const sessionId: unknown = req.cookies?.sid;

  if (typeof sessionId !== "string" || !sessionId) {
    throw new AppError(401, "Authentication is required");
  }

  const sessionHash = hashSessionId(sessionId);

  const userId = await redis.get(`session:${sessionHash}`);

  if (!userId) {
    throw new AppError(401, "Invalid or expired session");
  }

  req.userId = userId;
  req.sessionId = sessionId;

  next();
};
