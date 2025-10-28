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

// ========================================
// ADMIN ROUTES
// ========================================

// Get reward by ID
router.get("/:id", rewardController.getRewardById as any);

// Create reward
router.post("/", rewardController.createReward as any);

// Update reward
router.put("/:id", rewardController.updateReward as any);

// Delete reward
router.delete("/:id", rewardController.deleteReward as any);

// Get all user points (Admin)
router.get("/admin/user-points", rewardController.getAllUserPoints as any);

// Get user points by user ID (Admin)
router.get(
  "/admin/user-points/:userId",
  rewardController.getUserPointsByUserId as any
);

// Get user rewards by user ID (Admin)
router.get(
  "/admin/user-rewards/:userId",
  rewardController.getUserRewardsByUserId as any
);

// Get point values configuration (Admin)
router.get("/admin/point-values", rewardController.getPointValues as any);

// Update point values configuration (Admin)
router.put("/admin/point-values", rewardController.updatePointValues as any);

export default router;
