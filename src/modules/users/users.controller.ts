import type { Request, Response } from "express";
import { AppError } from "../../utils/app-error";
import { getCurrentUserService } from "./users.service";

export const getCurrentUser = async (req: Request, res: Response) => {
  if (!req.userId) {
    throw new AppError(401, "Authentication is required");
  }

  const user = await getCurrentUserService(req.userId);

  return res.status(200).json({
    status: "success",
    user,
    message: "Current user fetched successfully",
  });
};
