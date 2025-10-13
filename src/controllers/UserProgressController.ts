import { Response } from "express";
import { UserProgressService } from "../services/UserProgressService.js";
import { AuthenticatedRequest } from "../types/index.js";

export class UserProgressController {
  private progressService: UserProgressService;

  constructor() {
    this.progressService = new UserProgressService();
  }

  // ========================================
  // LESSON PROGRESS
  // ========================================

  /**
   * Update lesson progress
   */
  public updateLessonProgress = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      const { lessonId } = req.params;
      const { progress, timeSpent, sectionsCompleted } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const progressData = await this.progressService.updateLessonProgress(
        userId,
        lessonId,
        { progress, timeSpent, sectionsCompleted }
      );

      res.status(200).json({
        success: true,
        data: progressData,
      });
    } catch (error) {
      console.error("Update lesson progress error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update lesson progress",
      });
    }
  };

  /**
   * Get lesson progress
   */
  public getLessonProgress = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      const { lessonId } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const progress = await this.progressService.getLessonProgress(
        userId,
        lessonId
      );

      res.status(200).json({
        success: true,
        data: progress,
      });
    } catch (error) {
      console.error("Get lesson progress error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get lesson progress",
      });
    }
  };

  /**
   * Get all user lesson progress
   */
  public getUserLessonProgress = async (
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

      const { progress, total } =
        await this.progressService.getUserLessonProgress(userId, page, limit);

      res.status(200).json({
        success: true,
        data: progress,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get user lesson progress error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get user lesson progress",
      });
    }
  };

  // ========================================
  // QUIZ ATTEMPTS
  // ========================================

  /**
   * Record quiz attempt
   */
  public recordQuizAttempt = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      const { quizQuestionId } = req.params;
      const { answers, totalQuestions, timeSpent } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const attempt = await this.progressService.recordQuizAttempt(
        userId,
        quizQuestionId,
        { answers, totalQuestions, timeSpent }
      );

      res.status(201).json({
        success: true,
        data: attempt,
        message: "Quiz attempt recorded successfully",
      });
    } catch (error) {
      console.error("Record quiz attempt error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to record quiz attempt",
      });
    }
  };

  /**
   * Get quiz attempts
   */
  public getQuizAttempts = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      const quizQuestionId = req.query.quizQuestionId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const { attempts, total } = await this.progressService.getQuizAttempts(
        userId,
        quizQuestionId,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: attempts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get quiz attempts error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get quiz attempts",
      });
    }
  };

  /**
   * Get attempted question IDs for a user
   */
  public getAttemptedQuestionIds = async (
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

      const attemptedIds = await this.progressService.getAttemptedQuestionIds(
        userId
      );

      res.status(200).json({
        success: true,
        data: attemptedIds,
      });
    } catch (error) {
      console.error("Get attempted question IDs error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get attempted question IDs",
      });
    }
  };

  /**
   * Get today's progress statistics
   */
  public getTodayProgressStatistics = async (
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

      const todayStats = await this.progressService.getTodayProgressStatistics(
        userId
      );

      res.status(200).json({
        success: true,
        data: todayStats,
      });
    } catch (error) {
      console.error("Get today's progress statistics error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get today's progress statistics",
      });
    }
  };

  // ========================================
  // CODING ATTEMPTS
  // ========================================

  /**
   * Record coding attempt
   */
  public recordCodingAttempt = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      const { codingQuestionId } = req.params;
      const {
        code,
        language,
        status,
        testCasesPassed,
        totalTestCases,
        timeSpent,
        memory,
        runtime,
      } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const attempt = await this.progressService.recordCodingAttempt(
        userId,
        codingQuestionId,
        {
          code,
          language,
          status,
          testCasesPassed,
          totalTestCases,
          timeSpent,
          memory,
          runtime,
        }
      );

      res.status(201).json({
        success: true,
        data: attempt,
        message: "Coding attempt recorded successfully",
      });
    } catch (error) {
      console.error("Record coding attempt error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to record coding attempt",
      });
    }
  };

  /**
   * Get coding attempts
   */
  public getCodingAttempts = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      const codingQuestionId = req.query.codingQuestionId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const { attempts, total } = await this.progressService.getCodingAttempts(
        userId,
        codingQuestionId,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: attempts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get coding attempts error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get coding attempts",
      });
    }
  };

  // ========================================
  // PUZZLE ATTEMPTS
  // ========================================

  /**
   * Record puzzle attempt
   */
  public recordPuzzleAttempt = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      const { puzzleId } = req.params;
      const { solution, status, timeSpent, hintsUsed, points } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const attempt = await this.progressService.recordPuzzleAttempt(
        userId,
        puzzleId,
        { solution, status, timeSpent, hintsUsed, points }
      );

      res.status(201).json({
        success: true,
        data: attempt,
        message: "Puzzle attempt recorded successfully",
      });
    } catch (error) {
      console.error("Record puzzle attempt error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to record puzzle attempt",
      });
    }
  };

  /**
   * Get puzzle attempts
   */
  public getPuzzleAttempts = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      const puzzleId = req.query.puzzleId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const { attempts, total } = await this.progressService.getPuzzleAttempts(
        userId,
        puzzleId,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: attempts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get puzzle attempts error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get puzzle attempts",
      });
    }
  };

  // ========================================
  // BOOKMARKS
  // ========================================

  /**
   * Add bookmark
   */
  public addBookmark = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      const { resourceType, resourceId, title, notes } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const bookmark = await this.progressService.addBookmark(
        userId,
        resourceType,
        resourceId,
        title,
        notes
      );

      res.status(201).json({
        success: true,
        data: bookmark,
        message: "Bookmark added successfully",
      });
    } catch (error) {
      console.error("Add bookmark error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to add bookmark",
      });
    }
  };

  /**
   * Remove bookmark
   */
  public removeBookmark = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      const { resourceType, resourceId } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      await this.progressService.removeBookmark(
        userId,
        resourceType,
        resourceId
      );

      res.status(200).json({
        success: true,
        message: "Bookmark removed successfully",
      });
    } catch (error) {
      console.error("Remove bookmark error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to remove bookmark",
      });
    }
  };

  /**
   * Get user bookmarks
   */
  public getUserBookmarks = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      const resourceType = req.query.resourceType as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const { bookmarks, total } = await this.progressService.getUserBookmarks(
        userId,
        resourceType,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: bookmarks,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get user bookmarks error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get user bookmarks",
      });
    }
  };

  // ========================================
  // SUBJECT ENROLLMENT
  // ========================================

  /**
   * Enroll in subject
   */
  public enrollInSubject = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      const { subjectId } = req.params;
      const { totalLessons, totalQuizzes } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const enrollment = await this.progressService.enrollInSubject(
        userId,
        subjectId,
        totalLessons,
        totalQuizzes
      );

      res.status(201).json({
        success: true,
        data: enrollment,
        message: "Enrolled in subject successfully",
      });
    } catch (error) {
      console.error("Enroll in subject error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to enroll in subject",
      });
    }
  };

  /**
   * Update enrollment progress
   */
  public updateEnrollmentProgress = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      const { subjectId } = req.params;
      const { lessonsCompleted, quizzesCompleted } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const enrollment = await this.progressService.updateEnrollmentProgress(
        userId,
        subjectId,
        { lessonsCompleted, quizzesCompleted }
      );

      res.status(200).json({
        success: true,
        data: enrollment,
      });
    } catch (error) {
      console.error("Update enrollment progress error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update enrollment progress",
      });
    }
  };

  /**
   * Get user enrollments
   */
  public getUserEnrollments = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      const status = req.query.status as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const { enrollments, total } =
        await this.progressService.getUserEnrollments(
          userId,
          status,
          page,
          limit
        );

      res.status(200).json({
        success: true,
        data: enrollments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get user enrollments error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get user enrollments",
      });
    }
  };

  /**
   * Get enrollment by subject
   */
  public getEnrollmentBySubject = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.uid;
      const { subjectId } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const enrollment = await this.progressService.getEnrollmentBySubject(
        userId,
        subjectId
      );

      res.status(200).json({
        success: true,
        data: enrollment,
      });
    } catch (error) {
      console.error("Get enrollment by subject error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get enrollment",
      });
    }
  };

  // ========================================
  // STATISTICS & DASHBOARD
  // ========================================

  /**
   * Get user statistics
   */
  public getUserStatistics = async (
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

      const statistics = await this.progressService.getUserStatistics(userId);

      res.status(200).json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      console.error("Get user statistics error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get user statistics",
      });
    }
  };

  /**
   * Get user dashboard
   */
  public getUserDashboard = async (
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

      const dashboard = await this.progressService.getUserDashboard(userId);

      res.status(200).json({
        success: true,
        data: dashboard,
      });
    } catch (error) {
      console.error("Get user dashboard error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get user dashboard",
      });
    }
  };
}
