import type { Request, Response, CookieOptions } from "express";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { registerService, loginService } from "./auth.service.js";
import { env } from "../../config/env.config.js";
import { SESSION_TTL } from "../../utils/session.js";

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: SESSION_TTL * 1000,
};

// Register Controller

export const register = async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  const { user, sessionId } = await registerService(data);
  return res.cookie("sid", sessionId, COOKIE_OPTIONS).status(201).json({
    success: true,
    user,
    message: "User registered successfully",
  });
};

// Login Controller

export const login = async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);
  const { user, sessionId } = await loginService(data);
  return res.cookie("sid", sessionId, COOKIE_OPTIONS).status(200).json({
    success: true,
    user,
    message: "User logged in successfully",
  });
};
