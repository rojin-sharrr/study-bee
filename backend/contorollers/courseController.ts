import { Request, Response } from "express";
import { EntityCourses, EntityAsset, EntityAssetCourse } from "../entities";
import { ResponseHandler } from "../utils/response";
import { In } from "typeorm";
import { getAssetsFromCourseId } from "../services/assetServices";

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

const getCourseAssetsStatus = async (req: Request, res: Response) => {
  // this checks if any of the asset associated with this course is compelted or not
  const id = req.params.id;
  const course = await EntityCourses.findOne({
    where: { id },
  });

  if (!course) {
    throw new Error("Not found. Course with provided courseId not found");
  }


  const assets = await getAssetsFromCourseId(id);


  // now we need to check if all the assets are completed or not
  const allAssetsCompleted = assets.every(
    (asset) => asset.isEmbedding === "COMPLETED"
  );

  if (allAssetsCompleted) {
    ResponseHandler.success({
      res,
      message: "All assets are completed",
      data: true,
    });
  } else {
    ResponseHandler.success({
      res,
      message: "All assets are not completed",
      data: false,
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

    // Get all asset-course relationships for this course
    const relatedAssetCourses = await EntityAssetCourse.find({
      where: { course_id: course.id }
    });

    // Get all asset IDs from the relationships
    const assetIds = relatedAssetCourses.map(rel => rel.asset_id);

    // Delete the relationships from asset-course junction table
    await EntityAssetCourse.delete({ course_id: course.id });

    // Delete the actual assets
    if (assetIds.length > 0) {
      await EntityAsset.delete({ id: In(assetIds) });
    }

    // Finally delete the course
    await EntityCourses.delete({ id });

    ResponseHandler.success({
      res,
      message: "Course and associated assets deleted successfully",
    });
  } catch (error: any) {
    console.log("Error in delete course contoller catch block");
    ResponseHandler.error({
      message: error?.message || "Invalid ID",
      res,
    });
  }
};

export {
  createCourse,
  getUserCourses,
  getCourse,
  deleteCourse,
  getCourseAssetsStatus,
};
