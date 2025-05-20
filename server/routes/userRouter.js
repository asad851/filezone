import express from "express";
const router = express.Router();
import {
  loginController,
  logoutController,
  registerController,
  updateAvatarController,
} from "../controllers/authController.js";
import { uploadFileController } from "../controllers/uploadController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/update-avatar", authMiddleware, updateAvatarController);
router.post("/get-upload-urls", authMiddleware, uploadFileController);
export default router;
