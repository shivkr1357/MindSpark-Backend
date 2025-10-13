import { Router } from "express";
import { RewardController } from "../controllers/RewardController.js";
import { AuthMiddleware } from "../middleware/index.js";

const router = Router();
const rewardController = new RewardController();

// Apply authentication middleware to all routes
router.use(AuthMiddleware.verifyToken as any);

// ========================================
// USER POINTS & STATS ROUTES
// ========================================

// Get user's points and stats
router.get("/points", rewardController.getUserPoints as any);

// Get leaderboard
router.get("/leaderboard", rewardController.getLeaderboard as any);

// Get user's rank
router.get("/rank", rewardController.getUserRank as any);

// ========================================
// REWARDS ROUTES
// ========================================

// Get all available rewards
router.get("/all", rewardController.getAllRewards as any);

// Get user's earned rewards
router.get("/user", rewardController.getUserRewards as any);

// Check and award new achievements
router.post("/check-achievements", rewardController.checkAchievements as any);

export default router;
