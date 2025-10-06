import { Router } from "express";
import { MemeController } from "../controllers/MemeController.js";
import { AuthMiddleware } from "../middleware/index.js";

const router = Router();

// Public routes
router.get("/", MemeController.getAllMemes);
router.get("/trending", MemeController.getTrendingMemes);
router.get("/category/:category", MemeController.getMemesByCategory);
router.get("/:id", MemeController.getMemeById);

// Protected routes (require authentication)
router.use(AuthMiddleware.verifyToken as any);

// User engagement routes
router.post("/:id/engagement", MemeController.incrementEngagement);

// Admin-only routes
router.post("/", MemeController.createMeme);
router.put("/:id", MemeController.updateMeme);
router.delete("/:id", MemeController.deleteMeme);

export default router;
