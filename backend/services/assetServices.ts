import { EntityAsset, EntityAssetCourse, EntityCourses } from "../entities";
import Asset from "../entities/asset";
import { Request, Response } from "express";
import { ResponseHandler } from "../utils/response";
import { In } from "typeorm";
import isUUID from "../utils/isUuid";

const findAssetById = async (assetID: string): Promise<Asset | null> => {
  // Check if the provided assetID is an UUID
  if (!isUUID(assetID)) {
    throw new Error("The provided assetID is not an UUID.");
  }

  // Check if the course exists
  const asset = await EntityAsset.findOne({
    where: { id: assetID },
  });

  if (!asset) {
    return null;
  }
  return asset;
};

const getAssetsFromCourseId = async (courseId: string) => {
  // Then go to the asset-course table and make query to get: id of all the asset that has been created from that course.
  const courseAsset = await EntityAssetCourse.find({
    where: { course_id: courseId },
    select: ["asset_id"], // This will only select the asset_id field
  });

  // Convert to array of the asset_ids
  const assetIds = courseAsset.map((item) => item.asset_id);

  // Then go to the to asset table and get the data back from the asset table.
  const assets = await EntityAsset.find({
    where: {
      id: In(assetIds), // This will find all assets where id is in the assetIds array
    },
  });

  return assets;
};

const deleteAssetFromDB = async (assetId: string): Promise<void> => {
  // Delete from asset-course table first
  await EntityAssetCourse.delete({ asset_id: assetId });
  // Then delete from asset table
  await EntityAsset.delete({ id: assetId });
};

const checkAssetExist = async (assetId: string): Promise<Asset | null> => {
  const asset = await EntityAsset.findOne({
    where: { id: assetId },
  });

  if (!asset) {
    return null;
  }
  return asset;
};

const getAssetsWithStatus = async (
  status: "DRAFT" | "PROCESSING" | "COMPLETED"
) => {
  return await EntityAsset.find({
    where: {
      isEmbedding: "DRAFT",
    },
  });
};

export {
  getAssetsFromCourseId,
  findAssetById,
  deleteAssetFromDB,
  checkAssetExist,
  getAssetsWithStatus,
};
