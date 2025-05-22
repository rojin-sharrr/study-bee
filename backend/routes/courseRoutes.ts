import express from "express";
const router = express.Router();

import {
  createCourse,
  getUserCourses,
  getCourse,
  deleteCourse,
  getCourseAssetsStatus,
} from "../contorollers/courseController";
import protect from "../middleware/authMiddleware";

router.route("/create").post(protect, createCourse);
router.route("/").get(protect, getUserCourses);
router.route("/:id").get(protect, getCourse).delete(protect, deleteCourse);
router.route("/:id/assetstatus").get(protect, getCourseAssetsStatus);

export default router;
