import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/index.js";
import {
  FeaturedContent,
  InterviewQuestion,
  TopRatedSubject,
  Achievement,
  ProgressStats,
} from "../models/index.js";

export class DashboardController {
  /**
   * Get featured questions filtered by user attempts
   */
  private async getFilteredFeaturedQuestions(
    userId?: string,
    limit: number = 10
  ) {
    if (userId) {
      // Get attempted question IDs for this user
      const { UserAttemptedQuestion } = await import("../models/index.js");
      const attemptedQuestions = await UserAttemptedQuestion.find(
        { userId },
        { questionId: 1, _id: 0 }
      ).lean();

      const attemptedIds = attemptedQuestions.map((q) => q.questionId);

      console.log(
        `[getFilteredFeaturedQuestions] User ${userId} attempted questions:`,
        attemptedIds
      );

      // Get featured questions from the main InterviewQuestion collection (same as Interview Questions)
      // Only show questions explicitly marked as featured
      const featuredQuestions = await InterviewQuestion.find({
        isActive: true,
        featured: true,
        _id: { $nin: attemptedIds },
      })
        .populate("subjectId", "title")
        .populate("categoryId", "name slug icon color")
        .sort({ views: -1, createdAt: -1 })
        .limit(limit);

      console.log(
        `[getFilteredFeaturedQuestions] Found ${featuredQuestions.length} featured questions (excluding ${attemptedIds.length} attempted)`
      );
      console.log(
        `[getFilteredFeaturedQuestions] Attempted IDs:`,
        attemptedIds
      );
      console.log(
        `[getFilteredFeaturedQuestions] Featured question IDs:`,
        featuredQuestions.map((q: any) => q._id)
      );

      return featuredQuestions;
    } else {
      // No user authentication, return featured questions from main InterviewQuestion collection
      return await InterviewQuestion.find({
        isActive: true,
        featured: true,
      })
        .populate("subjectId", "title")
        .populate("categoryId", "name slug icon color")
        .sort({ views: -1, createdAt: -1 })
        .limit(limit);
    }
  }
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
      const userId = req.user?.uid;
      const featuredQuestions = await this.getFilteredFeaturedQuestions(
        userId,
        10
      );

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
        this.getFilteredFeaturedQuestions(userId, 5),
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
