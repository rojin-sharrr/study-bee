import express from "express";
const router = express.Router();
import {
  createAsset,
  getAllAsset,
  getAnAsset,
  deleteAsset,
  viewAsset,
} from "../contorollers/assetController";
import protect, { verifyCourseOwnership } from "../middleware/authMiddleware";
import upload from "../middleware/upload";

router.route("/").post(upload.single("uploaded-file"),  createAsset);
router.route("/courseid/:id").get(  getAllAsset,);
router.route("/:id").get(getAnAsset);
router.route("/:id").delete(deleteAsset);
router.route("/:id/view").get(viewAsset);

export default router;
