import { EntityCourses, EntityAssetCourse } from "../entities";
import Course from "../entities/course";
import isUUID from "../utils/isUuid";

const findCourseById = async (courseId: string): Promise<Course | null> => {
  // Check if the courseId is an UUID
  if (!isUUID(courseId)){
        throw new Error("The provided course")
  }
    // Check if the course exists
    const course = await EntityCourses.findOne({
      where: { id: courseId },
      relations: ["creator"],
    });

  return course;
};

const getCourseCreator = async (courseId: string): Promise<string> => {
  const course = await EntityCourses.findOne({
    where: { id: courseId },
    relations: ["creator"],
  });

  return course?.creator.id!;
};

const getCourseFromAssetId = async (
  assteId: string
): Promise<Course | null> => {
  const assetCourse = await EntityAssetCourse.findOne({
    where: { asset_id: assteId },
  });

  if (!assetCourse) {
    throw new Error("No course associated with the asset.");
  }

  const courseId = assetCourse.course_id;

  const course = await EntityCourses.findOne({
    where: { id: courseId },
    relations: ["creator"],
  });

  return course;
};

export { findCourseById, getCourseCreator, getCourseFromAssetId };
