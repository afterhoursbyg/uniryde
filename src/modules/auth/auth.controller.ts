import type { Request, Response } from "express";
import { registerSchema } from "./auth.schema.js";
import { registerService } from "./auth.service.js";
import { env } from "../../config/env.config.js";

export const register = async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  const { accessToken, refreshToken, user } = await registerService(data);
  return res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 15,
      path: "/",
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/auth/refresh",
    })
    .status(201)
    .json({
      user,
    });
};
