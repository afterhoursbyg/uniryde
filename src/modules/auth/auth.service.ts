import { prisma } from "../../lib/prisma.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";
import { AppError } from "../../utils/app-error.js";
import {
  createSession,
  deleteAllSessions,
  deleteSession,
} from "../../utils/session.js";

// Register Service

export const registerService = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (existingUser?.email === data.email) {
    throw new AppError(409, "Email already exists");
  }

  if (existingUser?.username === data.username) {
    throw new AppError(409, "Username already exists");
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

  const sessionId = await createSession(user.id);

  return {
    user,
    sessionId,
  };
};

// Login Service

export const loginService = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
    },
  });

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await verifyPassword(user.password, data.password);

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  const sessionId = await createSession(user.id);

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    sessionId,
  };
};

// Logout Service

export const logoutService = async (userId: string, sessionId: string) => {
  await deleteSession(userId, sessionId);
};

// Logout All Service

export async function logoutAllService(userId: string) {
  await deleteAllSessions(userId);
}
