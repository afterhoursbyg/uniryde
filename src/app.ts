import express, { type Express } from "express";
import cookieParser from "cookie-parser";

const app: Express = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, _res, next) => {
  console.log("REQUEST:", req.method, req.originalUrl);
  next();
});

// Routes
app.get("/api/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "UniRyde API is running",
  });
});

// 404 Error
app.use((_req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
