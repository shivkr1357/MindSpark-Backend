import { Router } from "express";
import { MemeController } from "../controllers/MemeController.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

// Public routes
router.get("/", MemeController.getAllMemes);
router.get("/trending", MemeController.getTrendingMemes);
router.get("/category/:category", MemeController.getMemesByCategory);
router.get("/:id", MemeController.getMemeById);

// Protected routes (require authentication)
router.use(authenticateToken);

// User engagement routes
router.post("/:id/engagement", MemeController.incrementEngagement);

// Admin-only routes
router.post("/", requireRole("admin"), MemeController.createMeme);
router.put("/:id", requireRole("admin"), MemeController.updateMeme);
router.delete("/:id", requireRole("admin"), MemeController.deleteMeme);

export default router;
