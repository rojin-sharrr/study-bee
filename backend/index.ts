import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import connectDB from "./config/data-source";
import userRoutes from "./routes/userRoutes";
import courseRoutes from "./routes/courseRoutes";
import assetRoutes from "./routes/assetRoutes";
import quizRoutes from "./routes/quizRoutes";
import chatRoutes from "./routes/chatRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";
import protect, { verifyCourseOwnership } from "./middleware/authMiddleware";
import cronFunction from "./services/cron.service";
import { sendDraftAssetIdForEmbeddings } from "./services/embeddingService";

const PORT = process.env.PORT;

async function startApp() {
  const app = express();
  await connectDB();

  // Body-parser middleware:
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Enable CORS middleware for all routes
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Additional headers for cookies.
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    next();
  });

  app.get("/", (req, res) => {
    res.send(`API running `);
  });

  app.use("/api/users", userRoutes);
  app.use("/api/course", courseRoutes);
  app.use("/api/asset", protect, verifyCourseOwnership, assetRoutes);
  app.use("/api/quiz", protect, verifyCourseOwnership, quizRoutes);
  app.use("/api/chat", protect, verifyCourseOwnership, chatRoutes);

  // handle errors
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.status(400).json({
      message: err.message,
      extrainfo: err.stack,
      success: false,
    });
  });

  cronFunction(60, sendDraftAssetIdForEmbeddings);

  app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
  });
}

startApp();
