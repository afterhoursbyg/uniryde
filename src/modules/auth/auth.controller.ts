import type { Request, Response, CookieOptions } from "express";
import { registerSchema } from "./auth.schema.js";
import { registerService } from "./auth.service.js";
import { env } from "../../config/env.config.js";

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days
};

export const register = async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  const { user, sessionId } = await registerService(data);
  return res.cookie("sid", sessionId, COOKIE_OPTIONS).status(201).json({
    user,
  });
};
