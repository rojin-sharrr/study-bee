import EntityUser from "./user";
import EntityCourses from "./course";
import EntityAsset from "./asset";
import EntityAssetCourse from "./asset-course";
import EntityQuiz from "./quiz";
import EntityQuizCourseAssets from "./quiz-course_assets";


export { EntityUser, EntityCourses, EntityAsset, EntityAssetCourse, EntityQuiz, EntityQuizCourseAssets };

// Export an array of entities instead of an object
export default [
  EntityUser,
  EntityCourses,
  EntityAsset,
  EntityAssetCourse,
  EntityQuiz,
  EntityQuizCourseAssets
];

