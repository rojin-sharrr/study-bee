import { Request, Response } from "express";
import { EntityAsset } from "../entities";
import { ResponseHandler } from "../utils/response";
import { parsePDF, requestLLM, saveDB } from "../services/pdfServices"

import fs from "fs";
import pdfParse from "pdf-parse";


// @desc  :   Create Course
// @route :   POST /api/course/create
// @access:   Private: Users
const createAsset = async (req: Request, res: Response) => {

  // Get the parsed pdf using the file we get from multer as req.file
  const pdf = await parsePDF(req, res);

  // Record in the database in asset table and asset_course table
  await saveDB(req, res, pdf);

  // generated question from Vercel ai-sdk
  const questions = await requestLLM(pdf);

  return ResponseHandler.success({
    res, 
    message: "Pdf parsed and then quiz generated succesfully",
    data: questions,
  })
};

export { createAsset };
