import { Request, Response } from "express";
import { EntityCourses } from "../entities";
import { ResponseHandler } from "../utils/response";

// @desc  :   Create Course
// @route :   POST /api/course/create
// @access:   Private: Users
const createCourse = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const user = req.user;

    if (!user) {
      ResponseHandler.unauthorized(res, "User not authenticated");
      return;
    }

    // Course title is required
    if (!name) {
      throw new Error("Bad Request: The course name is a required feild");
    }

    // Check if the course already exists for this user:
    const courseExist = await EntityCourses.findOne({
      where: {
        name: name,
        creator: { id: user.id },
      },
    });

    if (courseExist) {
      throw new Error("Bad Request: The course already exists");
    } else {
      const course = await EntityCourses.create({
        name,
        description,
        creator: user,
      }).save();

      ResponseHandler.success({
        res,
        data: course,
        message: "Course created successfully.",
      });
    }
    return;
  } catch (error: any) {
    ResponseHandler.error({
      res,
      message: error.message,
    });
  }
};

// @desc  :   Get user's all courses
// @route :   GET /api/course/create
// @access:   Private: Users
const getUserCourses = async (req: Request, res: Response) => {
  const user = req.user;

  // User Auth is required.
  if (!user) {
    ResponseHandler.unauthorized(res, "User not authenticated");
    return;
  }

  // getting all the courses created by user
  const courses = await EntityCourses.find({
    where: {
      creator: { id: user.id },
    },
  });

  // sending back the courses on response
  ResponseHandler.success({
    res,
    data: courses,
    message: "Courses fetched successfully.",
  });
};

// @desc  :   Get a course
// @route :   GET /api/course/:id
// @access:   Private: Users
const getCourse = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const course = await EntityCourses.findOne({
      where: { id: id },
    });
    if (course) {
      ResponseHandler.success({
        res,
        message: "Course fetched succesfully",
        data: course,
      });
    } else {
      ResponseHandler.notFound(res, "Not Found: no course found");
    }
  } catch (error) {
    ResponseHandler.error({
      statusCode: 400,
      message: "Invalid id",
      res,
    });
  }
};

// @desc  :   Delete a course
// @route :   DELETE /api/course/:id
// @access:   Private: Users
const deleteCourse = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const course = await EntityCourses.findOne({
      where: { id },
    });

    if (!course) {
      throw new Error("Not found. Course with provided courseId not found");
    }

    await EntityCourses.delete({ id });

    ResponseHandler.success({
      res,
      message: "Course Deleted successfully",
    });
  } catch (error: any) {
    console.log("Error in delete course contoller catch block");
    ResponseHandler.error({
      message: error?.message || "Invalid ID",
      res,
    });
  }
};

export { createCourse, getUserCourses, getCourse, deleteCourse };
