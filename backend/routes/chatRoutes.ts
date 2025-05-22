import express from "express";
import { Router } from "express";
import upload from "../middleware/upload";
import { getChatbotResponse } from "../contorollers/chatController";
import protect, { verifyCourseOwnership, verifyCourseEmbedding } from "../middleware/authMiddleware";
const router: express.Router = Router();

// given user owns this course and course is ready to be chatted with
router.route("/").post(
  protect,
  verifyCourseOwnership,
  verifyCourseEmbedding,
  getChatbotResponse
);

export default router;
