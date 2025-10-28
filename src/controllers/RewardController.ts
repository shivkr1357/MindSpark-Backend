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

  // ==================== ADMIN ENDPOINTS ====================

  /**
   * Get reward by ID (Admin)
   */
  public getRewardById = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const reward = await this.rewardService.getRewardById(id);

      if (!reward) {
        res.status(404).json({
          success: false,
          error: "Reward not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: reward,
      });
    } catch (error) {
      console.error("Get reward by ID error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get reward",
      });
    }
  };

  /**
   * Create reward (Admin)
   */
  public createReward = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const reward = await this.rewardService.createReward(req.body);

      res.status(201).json({
        success: true,
        data: reward,
        message: "Reward created successfully",
      });
    } catch (error) {
      console.error("Create reward error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create reward",
      });
    }
  };

  /**
   * Update reward (Admin)
   */
  public updateReward = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const reward = await this.rewardService.updateReward(id, req.body);

      if (!reward) {
        res.status(404).json({
          success: false,
          error: "Reward not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: reward,
        message: "Reward updated successfully",
      });
    } catch (error) {
      console.error("Update reward error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update reward",
      });
    }
  };

  /**
   * Delete reward (Admin)
   */
  public deleteReward = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await this.rewardService.deleteReward(id);

      res.status(200).json({
        success: true,
        message: "Reward deleted successfully",
      });
    } catch (error) {
      console.error("Delete reward error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete reward",
      });
    }
  };

  /**
   * Get all user points (Admin)
   */
  public getAllUserPoints = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const tier = req.query.tier as string | undefined;

      const { userPoints, total } = await this.rewardService.getAllUserPoints(
        page,
        limit,
        tier
      );

      res.status(200).json({
        success: true,
        data: userPoints,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get all user points error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get user points",
      });
    }
  };

  /**
   * Get user points by user ID (Admin)
   */
  public getUserPointsByUserId = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      const userPoints = await this.rewardService.getUserPoints(userId);

      if (!userPoints) {
        res.status(404).json({
          success: false,
          error: "User points not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: userPoints,
      });
    } catch (error) {
      console.error("Get user points by ID error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get user points",
      });
    }
  };

  /**
   * Get user rewards by user ID (Admin)
   */
  public getUserRewardsByUserId = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

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
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get user rewards by ID error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get user rewards",
      });
    }
  };

  /**
   * Get point values configuration (Admin)
   */
  public getPointValues = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const pointValues = this.rewardService.getPointValues();

      res.status(200).json({
        success: true,
        data: pointValues,
      });
    } catch (error) {
      console.error("Get point values error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get point values",
      });
    }
  };

  /**
   * Update point values configuration (Admin)
   */
  public updatePointValues = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const updatedValues = await this.rewardService.updatePointValues(
        req.body
      );

      res.status(200).json({
        success: true,
        data: updatedValues,
        message: "Point values updated successfully",
      });
    } catch (error) {
      console.error("Update point values error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update point values",
      });
    }
  };
}
