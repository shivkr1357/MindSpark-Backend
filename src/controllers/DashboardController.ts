import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/index.js";
import {
  FeaturedContent,
  FeaturedQuestion,
  TopRatedSubject,
  Achievement,
  ProgressStats,
} from "../models/index.js";

export class DashboardController {
  /**
   * Get featured content for dashboard
   */
  public getFeaturedContent = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const featuredContent = await FeaturedContent.find({ isActive: true })
        .sort({ rating: -1, students: -1 })
        .limit(10);

      res.status(200).json({
        success: true,
        data: featuredContent,
        message: "Featured content retrieved successfully",
      });
    } catch (error) {
      console.error("Get featured content error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get featured content",
      });
    }
  };

  /**
   * Get featured questions for dashboard
   */
  public getFeaturedQuestions = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const featuredQuestions = await FeaturedQuestion.find({ isActive: true })
        .sort({ views: -1 })
        .limit(10);

      res.status(200).json({
        success: true,
        data: featuredQuestions,
        message: "Featured questions retrieved successfully",
      });
    } catch (error) {
      console.error("Get featured questions error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get featured questions",
      });
    }
  };

  /**
   * Get top rated subjects for dashboard
   */
  public getTopRatedSubjects = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const topRatedSubjects = await TopRatedSubject.find({ isActive: true })
        .sort({ rating: -1, students: -1 })
        .limit(10);

      res.status(200).json({
        success: true,
        data: topRatedSubjects,
        message: "Top rated subjects retrieved successfully",
      });
    } catch (error) {
      console.error("Get top rated subjects error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get top rated subjects",
      });
    }
  };

  /**
   * Get recent achievements for dashboard
   */
  public getRecentAchievements = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      const recentAchievements = await Achievement.find({
        userId: userId || { $exists: false },
        isActive: true,
      })
        .sort({ date: -1 })
        .limit(10);

      res.status(200).json({
        success: true,
        data: recentAchievements,
        message: "Recent achievements retrieved successfully",
      });
    } catch (error) {
      console.error("Get recent achievements error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get recent achievements",
      });
    }
  };

  /**
   * Get home progress stats
   */
  public getHomeProgressStats = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      let progressStats = await ProgressStats.findOne({
        userId: userId || { $exists: false },
      });

      if (!progressStats) {
        // Create default progress stats if none exist (use upsert to handle duplicates)
        progressStats = await ProgressStats.findOneAndUpdate(
          { userId: userId || "default" },
          {
            userId: userId || "default",
            lessonsCompleted: 0,
            questionsAnswered: 0,
            accuracy: 0,
            totalStudyTime: 0,
            streak: 0,
            level: 1,
            experience: 0,
            createdBy: userId || "system",
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }

      res.status(200).json({
        success: true,
        data: progressStats,
        message: "Progress stats retrieved successfully",
      });
    } catch (error) {
      console.error("Get progress stats error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get progress stats",
      });
    }
  };

  /**
   * Get combined dashboard data
   */
  public getDashboardData = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;

      // Fetch all dashboard data in parallel
      const [
        featuredContent,
        featuredQuestions,
        topRatedSubjects,
        recentAchievements,
        progressStats,
      ] = await Promise.all([
        FeaturedContent.find({ isActive: true })
          .sort({ rating: -1, students: -1 })
          .limit(5),
        FeaturedQuestion.find({ isActive: true }).sort({ views: -1 }).limit(5),
        TopRatedSubject.find({ isActive: true })
          .sort({ rating: -1, students: -1 })
          .limit(5),
        Achievement.find({
          userId: userId || { $exists: false },
          isActive: true,
        })
          .sort({ date: -1 })
          .limit(5),
        ProgressStats.findOne({ userId: userId || { $exists: false } }),
      ]);

      // Create default progress stats if none exist
      const finalProgressStats = progressStats || {
        lessonsCompleted: 0,
        questionsAnswered: 0,
        accuracy: 0,
      };

      const dashboardData = {
        featuredContent,
        featuredQuestions,
        topRatedSubjects,
        recentAchievements,
        progressStats: finalProgressStats,
      };

      res.status(200).json({
        success: true,
        data: dashboardData,
        message: "Dashboard data retrieved successfully",
      });
    } catch (error) {
      console.error("Get dashboard data error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get dashboard data",
      });
    }
  };
}
