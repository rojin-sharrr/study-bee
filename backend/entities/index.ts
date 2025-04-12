import EntityUser from "./user";
import EntityCourses from "./course";
import EntityAsset from "./asset";
import EntityAssetCourse from "./asset-course";

export { EntityUser, EntityCourses, EntityAsset, EntityAssetCourse };

// Export an array of entities instead of an object
export default [
  EntityUser,
  EntityCourses,
  EntityAsset,
  EntityAssetCourse
];

