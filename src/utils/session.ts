import crypto from "node:crypto";
import { redis } from "../lib/redis";

const SESSION_TTL = 60 * 60 * 24 * 15; // 15 days

const generateSessionId = () => {
  return crypto.randomBytes(32).toString("base64url");
};

const hashSessionId = (sessionId: string) => {
  return crypto.createHash("sha256").update(sessionId).digest("hex");
};

export const createSession = async (userId: string) => {
  const sessionId = generateSessionId();
  const sessionHash = hashSessionId(sessionId);

  await redis
    .multi()
    .set(`session:${sessionHash}`, userId, {
      EX: SESSION_TTL,
    })
    .sAdd(`user_sessions:${userId}`, sessionHash)
    .exec();

  return sessionId;
};
