import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  deleteSegment,
  getSegmentController,
  newSegmentController,
  updateSegment,
} from "../controllers/segmentControllers.js";
const router = express.Router();

router.post("/create", authMiddleware, newSegmentController);
router.get("/get", authMiddleware, getSegmentController);
router.put("/update/:id", authMiddleware, updateSegment);
router.delete("/delete/:id", authMiddleware, deleteSegment);

export default router;
