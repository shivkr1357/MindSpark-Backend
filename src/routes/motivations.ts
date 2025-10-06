import { Router } from "express";
import { MotivationController } from "../controllers/MotivationController.js";
import { AuthMiddleware } from "../middleware/index.js";

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
router.use(AuthMiddleware.verifyToken as any);

// User engagement routes
router.post("/:id/engagement", MotivationController.incrementEngagement);

// Admin-only routes
router.post("/", MotivationController.createMotivation);
router.put("/:id", MotivationController.updateMotivation);
router.delete(
  "/:id",

  MotivationController.deleteMotivation
);

export default router;
