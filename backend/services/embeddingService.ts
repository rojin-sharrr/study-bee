import { getAssetsWithStatus } from "./assetServices";
import { createEmbeddingsByAssetId } from "./chatServices";
import { getCourseCreator, getCourseFromAssetId } from "./courseServices";

export const sendDraftAssetIdForEmbeddings = async () => {
  const assetsWithDraft = await getAssetsWithStatus("DRAFT");
  // console.log("I found this many", assetsWithDraft.length);

  if (assetsWithDraft.length > 0) {
    for (let { id: assetId } of assetsWithDraft) {
      console.log(`AssetId: ${assetId}`)
      const course = await getCourseFromAssetId(assetId);
      console.log(`CourseId: ${course?.id}`)
      if(!course){
        console.log(`Not found. No course found in sendDraftAssetIdForEmbeddings`)
        throw new Error("Course not found")
      } 
      const userId = await getCourseCreator(course.id);
      await createEmbeddingsByAssetId(assetId, course.id, userId);
    }
  }
};
