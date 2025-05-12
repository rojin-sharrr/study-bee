import express from "express";
const router = express.Router();
import protect, { verifyCourseOwnership } from "../middleware/authMiddleware";
import { createQuizFromAsset, getQuizById, getAllQuizzes, setHighScore } from "../contorollers/quizController"


router.route("/").post( createQuizFromAsset);
router.route("/:id").get( getQuizById);
router.route("/course/:id").get( getAllQuizzes);
router.route("/highscore").post( setHighScore);

export default router;



