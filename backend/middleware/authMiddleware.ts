import jwt from "jsonwebtoken";
import { EntityAssetCourse, EntityCourses, EntityUser } from "../entities";
import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../utils/response";
import Course from "../entities/course";
import { getAssetsFromCourseId } from "../services/assetServices";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: EntityUser;
      course?: Course;
    }
  }
}

//For Protect routes: checks and verifies the jwt tokens(for users who have logged in and have not logged out)
const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    token = req.cookies.jwt;

    if (!token) {
      throw new Error("Not Authorized. No token found.");
    }
    // decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string;
    };

    // Find user from using decoded token
    const user = await EntityUser.findOne({
      where: { email: decoded.email },
    });

    if (!user) {
      throw new Error("Not found. User not found.");
    }
    // Attach the request with the user( fetched from token)
    req.user = user;
    next();
  } catch (error: any) {
    ResponseHandler.error({
      res,
      message:
        error.message ||
        "An error occurred while verifying the user with cookies.",
    });
    return;
  }
};

export const verifyCourseOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.query as {
      courseId: string;
    };

    if (!courseId) {
      throw new Error("No course provided in query params");
    }

    const course = await EntityCourses.findOne({
      where: { id: courseId },
      relations: ["creator"],
    });

    if (!course) {
      throw new Error("No course found for the provided courseId");
    }

    if (course.creator.id !== req.user!.id) {
      throw new Error("Not authorized. You are not the owner of this course.");
    }
    
    // Attach the request with the course( fetched from courseId)
    req.course = course;

    next();
  } catch (error: any) {
    console.log(
      error.message || "Error occurred in verifyCourseOwnership middleware"
    );
    ResponseHandler.error({
      res,
      message: error.message || "Error verifying course's ownership",
    });
  }
};

export const verifyCourseEmbedding = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`verify course embedding middleware hit`);
  const { courseId } = req.query as { courseId: string };

  if(!courseId){
    console.log(`No CourseId in query Params for verifyCourseEmbedding middleware`)
    throw new Error("No CourseId Provided")
  }

  const assets = await getAssetsFromCourseId(courseId);

   // now we need to check if all the assets are completed or not
   const allAssetsCompleted = assets.every(
    (asset) => asset.isEmbedding === "COMPLETED"
  );

  if(allAssetsCompleted){
    next();
  }else{
    res.send({
      success: false,
      data: null,
    });
  }
};

export default protect;
