import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  DATABASE_URL:
    process.env.DATABASE_URL ??
    (() => {
      throw new Error("Missing DATABASE_URL environment variable");
    })(),
};
