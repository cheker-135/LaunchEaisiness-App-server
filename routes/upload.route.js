import express from "express";
import { upload } from "../config/multer.config.js";
import protectRoute from "../middlewares/protectRoute.js";
import {
  uploadSingleFile,
  uploadFiles,
  deletePDF,
} from "../controllers/upload.controller.js";
const router = express.Router();

router.post(
  "/single",
  protectRoute,
  upload.single("picture"),
  uploadSingleFile
);

// Single pdf upload route
router.post(
  "/pdf",
  protectRoute,
  upload.fields([{ name: "pdf", maxCount: 10 }]),
  uploadFiles
);

router.delete("/pdf/:id", protectRoute, deletePDF);

export default router;
