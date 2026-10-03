import { createServer } from "http";

import app from "./app.js";
import { env } from "./config/env.config.js";
import { redis } from "./lib/redis.js";

const startServer = async (): Promise<void> => {
  try {
    await redis.connect();
    const server = createServer(app);

    server.listen(env.PORT, () => {
      console.log(`Server Running On Port: ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
