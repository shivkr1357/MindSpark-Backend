import { Router } from "express";
import { UploadController } from "../controllers/UploadController.js";
import { AuthMiddleware } from "../middleware/index.js";

const router = Router();
const uploadController = new UploadController();

// Apply authentication middleware to all routes
router.use(AuthMiddleware.verifyToken as any);

// Get upload configuration
router.get("/config", uploadController.getUploadConfig as any);

// Upload single file
router.post(
  "/single",
  uploadController.getUploadMiddleware().single("file"),
  uploadController.handleUploadError,
  uploadController.uploadFile as any
);

// Upload multiple files
router.post(
  "/multiple",
  uploadController.getUploadMiddleware().array("files", 10),
  uploadController.handleUploadError,
  uploadController.uploadMultipleFiles as any
);

// Upload lesson files
router.post(
  "/lesson",
  uploadController.getUploadMiddleware("lesson").single("file"),
  uploadController.handleUploadError,
  uploadController.uploadFile as any
);

// Upload fun content files
router.post(
  "/fun",
  uploadController.getUploadMiddleware("fun").single("file"),
  uploadController.handleUploadError,
  uploadController.uploadFile as any
);

// Upload avatar files
router.post(
  "/avatar",
  uploadController.getUploadMiddleware("avatar").single("file"),
  uploadController.handleUploadError,
  uploadController.uploadFile as any
);

// Delete file
router.delete("/", uploadController.deleteFile as any);

export default router;
