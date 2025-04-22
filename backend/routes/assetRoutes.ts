import express from "express";
const router = express.Router();

import { createAsset, getAllAsset, getAnAsset }  from "../contorollers/assetController";
import protect from "../middleware/authMiddleware";
import upload from "../middleware/upload";


router.route("/").post( protect, upload.single("uploaded-file"), createAsset );
router.route("/courseid/:id").get(protect,  getAllAsset);
router.route("/:id").get(protect, getAnAsset);


export default router;
