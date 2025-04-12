import express from "express";
const router = express.Router();

import { createCourse, getUserCourses, getCourse, deleteCourse } from "../contorollers/courseController";
import protect from "../middleware/authMiddleware";

router.route("/create").post( protect , createCourse);
router.route("/").get(protect, getUserCourses);
router.route("/:id").get(protect, getCourse).delete(protect, deleteCourse);


export default router;