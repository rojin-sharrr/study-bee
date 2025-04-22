import { Request, Response } from "express";
import { ResponseHandler } from "../utils/response";
import { parsePDF, requestLLM, saveDB } from "../services/pdfServices";

import verifyOwnership from "../utils/verifyOwnership";
import { findCourseById, getCourseFromAssetId } from "../services/courseServices";
import { findAssetById, getAssetsFromCourseId } from "../services/assetServices";


// @desc  :   Create an Asset
// @route :   POST /api/asset
// @access:   Private: Users
const createAsset = async (req: Request, res: Response) => {
  // Get the parsed pdf using the file we get from multer as req.file
  const pdf = await parsePDF(req, res);

  // Record in the database in asset table and asset_course table
  await saveDB(req, pdf);

  // generated question from Vercel ai-sdk
  const questions = await requestLLM(pdf);

  ResponseHandler.success({
    res,
    message: "Pdf parsed and then quiz generated succesfully",
    data: questions,
  });
};

// @desc  :   Get all the assets linked to a certain course of an user
// @route :   GET api/asset/courseid/:id
// @access:   Private: Users
const getAllAsset = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id;

    // verify the course UUID and course exists
    const course = await findCourseById(courseId);

    if (!course) {
      throw new Error("No valid course found for given id");
    }

    // Verify ownership. //todo: exclamation a bad prac here?
    verifyOwnership(course.creator.id, req.user?.id!);

    const allAssets = await getAssetsFromCourseId(courseId);

    ResponseHandler.success({
      res,
      message: "Success: Assets fetched succesfully. ",
      data: allAssets,
    });
  } catch (error: any) {
    console.log(error);
    ResponseHandler.error({
      res,
      message: error?.message || "Something wrong happened",
    });
  }
};

// @desc  :   Get a specific asset
// @route :   GET api/asset/:id
// @access:   Private: Users
const getAnAsset = async (req: Request, res: Response): Promise<void> => {
  try {
    const assetId = req.params.id;

    // Check if asset exists
    const asset = await findAssetById(assetId);

    if (!asset) {
      throw new Error("Not Found: Asset not found for the provided assetId");
    }


    const assetsCourse = await getCourseFromAssetId(assetId);
    if (!assetsCourse) {
      throw new Error("Not Found: No course associated with this asset");
    }

    // Verify ownership
    const ownerVerified = verifyOwnership(assetsCourse.creator.id, req.user?.id!);

    if(!ownerVerified){
      // ResponseHandler.unauthorized(res, "Unauthorized: Logged in user is not the creator of the asset's course.");
      // return;
      throw new Error("The logged in user is not the owner of this assset's course.")
    }

    ResponseHandler.success({
      res,
      message: "Success: Asset fetched successfully",
      data: asset,
    });
  } catch (error) {
    ResponseHandler.error({
      res,
      message: "Error Fetching asset",
      error,
    });
  }
};

export { createAsset, getAllAsset, getAnAsset };
