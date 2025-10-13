import { Response } from "express";
import { RewardService } from "../services/RewardService.js";
import { AuthenticatedRequest } from "../types/index.js";

export class RewardController {
  private rewardService: RewardService;

  constructor() {
    this.rewardService = new RewardService();
  }

  /**
   * Get user's points and stats
   */
  public getUserPoints = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const userPoints = await this.rewardService.getUserPoints(userId);

      res.status(200).json({
        success: true,
        data: userPoints,
      });
    } catch (error) {
      console.error("Get user points error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get user points",
      });
    }
  };

  /**
   * Get leaderboard
   */
  public getLeaderboard = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const tier = req.query.tier as
        | "bronze"
        | "silver"
        | "gold"
        | "platinum"
        | "diamond"
        | undefined;

      const leaderboard = await this.rewardService.getLeaderboard(limit, tier);

      res.status(200).json({
        success: true,
        data: leaderboard,
      });
    } catch (error) {
      console.error("Get leaderboard error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get leaderboard",
      });
    }
  };

  /**
   * Get user's rank
   */
  public getUserRank = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const userPoints = await this.rewardService.getUserPoints(userId);
      if (!userPoints) {
        res.status(404).json({
          success: false,
          error: "User points not found",
        });
        return;
      }

      // Get rank by counting users with higher points
      const leaderboard = await this.rewardService.getLeaderboard(10000);
      const rank = leaderboard.findIndex((u) => u.userId === userId) + 1 || 0;

      res.status(200).json({
        success: true,
        data: {
          rank,
          totalUsers: leaderboard.length,
          percentile:
            leaderboard.length > 0
              ? Math.round((1 - rank / leaderboard.length) * 100)
              : 0,
          userPoints,
        },
      });
    } catch (error) {
      console.error("Get user rank error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get user rank",
      });
    }
  };

  /**
   * Get all available rewards
   */
  public getAllRewards = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const category = req.query.category as string | undefined;
      const tier = req.query.tier as string | undefined;

      const rewards = await this.rewardService.getAllRewards(category, tier);

      res.status(200).json({
        success: true,
        data: rewards,
      });
    } catch (error) {
      console.error("Get all rewards error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get rewards",
      });
    }
  };

  /**
   * Get user's earned rewards
   */
  public getUserRewards = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const { rewards, total } = await this.rewardService.getUserRewards(
        userId,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: rewards,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get user rewards error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get user rewards",
      });
    }
  };

  /**
   * Check and award new achievements
   */
  public checkAchievements = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const newRewards = await this.rewardService.checkAndAwardAchievements(
        userId
      );

      res.status(200).json({
        success: true,
        data: {
          newRewards,
          count: newRewards.length,
        },
        message:
          newRewards.length > 0
            ? `Congratulations! You earned ${newRewards.length} new reward(s)!`
            : "No new rewards at this time",
      });
    } catch (error) {
      console.error("Check achievements error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to check achievements",
      });
    }
  };
}
