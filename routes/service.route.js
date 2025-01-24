import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {
  addService,
  deleteService,
  getAllServices,
  getServiceById,
  updateService,
} from "../controllers/service.controller.js";
import { upload } from "../config/multer.config.js";

const router = express.Router();

router.post(
  "/add-service",
  protectRoute,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "files", maxCount: 10 },
  ]),
  addService
);
router.get("/", getAllServices);
router.get("/:id", protectRoute, getServiceById);
router.put("/update/:id", protectRoute, updateService);
router.delete("/delete/:id", protectRoute, deleteService);

export default router;
