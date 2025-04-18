import express from "express";
const router = express.Router();

import { createAsset }  from "../contorollers/assetController";
import protect from "../middleware/authMiddleware";
import upload from "../middleware/upload";


router.route("/").post( protect, upload.single("uploaded-file"), createAsset );


export default router;
