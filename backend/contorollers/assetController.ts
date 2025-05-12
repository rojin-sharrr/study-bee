import { Request, Response } from "express";
import { ResponseHandler } from "../utils/response";
import { parsePDF, requestLLM, saveDB } from "../services/pdfServices";
import fs from "fs/promises";
import { In } from "typeorm";

import verifyOwnership from "../utils/verifyOwnership";
import {
  findCourseById,
  getCourseFromAssetId,
} from "../services/courseServices";
import {
  findAssetById,
  getAssetsFromCourseId,
  deleteAssetFromDB,
  checkAssetExist,
} from "../services/assetServices";
import {
  EntityAssetCourse,
  EntityQuiz,
  EntityQuizCourseAssets,
} from "../entities";
import getBuffer from "../utils/getBuffer";
import quizServices from "../services/quizServices";

// @desc  :   Create an Asset
// @route :   POST /api/asset/
// @access:   Private: Users
const createAsset = async (req: Request, res: Response) => {
  try {
    const course_id = req.body.course_id;
    const filePath = `./file-uploads/${req.file?.filename}`;
    const fileName = req.file?.originalname;
    const fileType = req.file?.mimetype;
    const file = `./${req.file?.path}`;

    if (!course_id) {
      throw new Error("No course id provided.");
    }

    const course = await findCourseById(course_id);
    if (!course) {
      throw new Error("Not Found: No course found");
    }

    // check ownership
    if (!verifyOwnership(course.creator.id, req.user?.id!)) {
      throw new Error(
        "Not Authorized: Logged in user is not the owner of the course."
      );
    }

    // Get the parsed pdf using the file we get from multer as req.file
    const pdf = await parsePDF(filePath);

    // Record in the database in asset table and asset_course table
    await saveDB(fileName, fileType, file, course_id);

    //Todo: Add the requestLLM later whenn generating the quiz.
    // generated question from Vercel ai-sdk
    // const questions = await requestLLM(pdf);

    ResponseHandler.success({
      res,
      message: "Pdf parsed and saved to db succesfully",
      data: null,
    });
  } catch (error: any) {
    ResponseHandler.error({
      res,
      message: error.message || "Error creating an asset",
    });
  }
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
    const ownerVerified = verifyOwnership(
      assetsCourse.creator.id,
      req.user?.id!
    );

    if (!ownerVerified) {
      throw new Error(
        "The logged in user is not the owner of this assset's course."
      );
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

// @desc  :   Delete an asset
// @route :   DELETE api/asset/:id
// @access:   Private: Users
const deleteAsset = async (req: Request, res: Response) => {
  try {
    const assetId = req.params.id;
    const asset = await findAssetById(assetId);
    if (!asset) {
      throw new Error("Not Found: Asset not found for the provided assetId");
    }

    // Get course and verify ownership
    const course = await getCourseFromAssetId(assetId);
    if (!course) {
      throw new Error("Not Found: No course associated with this asset");
    }

    await deleteAssetFromDB(assetId);

    ResponseHandler.success({
      res,
      message: "Asset deleted successfully",
    });
  } catch (error: any) {
    ResponseHandler.error({
      res,
      message: error.message || "Error deleting asset",
      error,
    });
  }
};

// view asset
// GET: api/asset/:id/view
const viewAsset = async (req: Request, res: Response) => {
  try {
    console.log(`View Asset Controller hit`);
    const assetId = req.params.id;
    console.log(`Requested asset's id: ${assetId}`);

    const asset = await checkAssetExist(assetId);

    if (!asset) {
      throw new Error("Not found: Asset not found");
    }

    const filePath = asset.file;
    console.log(`This is the filePath of the asset: ${filePath}`);

    const buffer = await getBuffer(filePath);

    if (!buffer) {
      throw new Error("Not found: Asset not found");
    }
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${asset.name}"`);
    res.send(buffer);
  } catch (error) {
    ResponseHandler.error({
      res,
      message: "Error in returning buffer in viewAsset",
    });
  }
};

export { createAsset, getAllAsset, getAnAsset, deleteAsset, viewAsset };
