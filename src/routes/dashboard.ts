import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController.js";
import { AuthMiddleware } from "../middleware/index.js";

const router = Router();
const dashboardController = new DashboardController();

// Apply authentication middleware to all routes
router.use(AuthMiddleware.verifyToken as any);

// Dashboard routes
router.get("/featured-content", dashboardController.getFeaturedContent as any);
router.get(
  "/featured-questions",
  dashboardController.getFeaturedQuestions as any
);
router.get(
  "/top-rated-subjects",
  dashboardController.getTopRatedSubjects as any
);
router.get(
  "/recent-achievements",
  dashboardController.getRecentAchievements as any
);
router.get("/progress-stats", dashboardController.getHomeProgressStats as any);
router.get("/", dashboardController.getDashboardData as any);

export default router;
