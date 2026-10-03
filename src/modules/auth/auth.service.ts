import { redis } from "../../lib/redis.js";
import { prisma } from "../../lib/prisma.js";
import { hashPassword } from "../../utils/password.js";
import type { RegisterInput } from "./auth.schema.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateSessionId,
  hashRefreshToken,
} from "../../utils/token.js";
import { AppError } from "../../utils/app-error.js";

export const registerService = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError(409, "User already exists");
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: passwordHash,
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });

  const sessionId = generateSessionId();
  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);
  const accessToken = generateAccessToken(user.id, sessionId);
  const sessionKey = `session:${sessionId}`;

  await redis.hSet(sessionKey, {
    userId: user.id,
    refreshTokenHash,
  });

  await redis.expire(sessionKey, 60 * 60 * 24 * 30); // 30 days

  return { accessToken, refreshToken, user };
};
