import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.config";

export const generateSessionId = () => {
  return crypto.randomUUID();
};

export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("base64url");
};

export const hashRefreshToken = (refreshToken: string) => {
  return crypto.createHash("sha256").update(refreshToken, "utf8").digest("hex");
};

export const generateAccessToken = (userId: string, sessionId: string) => {
  return jwt.sign(
    {
      userId,
      sessionId,
    },
    env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET);
};
