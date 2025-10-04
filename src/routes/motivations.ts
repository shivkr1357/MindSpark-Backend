import { Router } from "express";
import { MotivationController } from "../controllers/MotivationController.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

// Public routes
router.get("/", MotivationController.getAllMotivations);
router.get("/featured", MotivationController.getFeaturedMotivations);
router.get(
  "/category/:category",
  MotivationController.getMotivationsByCategory
);
router.get("/type/:type", MotivationController.getMotivationsByType);
router.get("/:id", MotivationController.getMotivationById);

// Protected routes (require authentication)
router.use(authenticateToken);

// User engagement routes
router.post("/:id/engagement", MotivationController.incrementEngagement);

// Admin-only routes
router.post("/", requireRole("admin"), MotivationController.createMotivation);
router.put("/:id", requireRole("admin"), MotivationController.updateMotivation);
router.delete(
  "/:id",
  requireRole("admin"),
  MotivationController.deleteMotivation
);

export default router;
