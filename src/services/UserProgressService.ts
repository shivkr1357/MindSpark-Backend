import {
  UserLessonProgress,
  UserQuizAttempt,
  UserCodingAttempt,
  UserPuzzleAttempt,
  UserBookmark,
  UserSubjectEnrollment,
} from "../models/index.js";
import type {
  IUserLessonProgress,
  IUserQuizAttempt,
  IUserCodingAttempt,
  IUserPuzzleAttempt,
  IUserBookmark,
  IUserSubjectEnrollment,
} from "../models/index.js";

export class UserProgressService {
  // ========================================
  // LESSON PROGRESS
  // ========================================

  /**
   * Update or create lesson progress
   */
  public async updateLessonProgress(
    userId: string,
    lessonId: string,
    progressData: {
      progress?: number;
      timeSpent?: number;
      sectionsCompleted?: string[];
    }
  ): Promise<IUserLessonProgress> {
    try {
      const existingProgress = await UserLessonProgress.findOne({
        userId,
        lessonId,
      });

      if (existingProgress) {
        // Update existing
        if (progressData.progress !== undefined) {
          existingProgress.progress = progressData.progress;
        }
        if (progressData.timeSpent !== undefined) {
          existingProgress.timeSpent += progressData.timeSpent;
        }
        if (progressData.sectionsCompleted) {
          existingProgress.sectionsCompleted = [
            ...new Set([
              ...existingProgress.sectionsCompleted,
              ...progressData.sectionsCompleted,
            ]),
          ];
        }
        existingProgress.lastAccessedAt = new Date();
        await existingProgress.save();
        return existingProgress.toObject();
      } else {
        // Create new
        const progress = new UserLessonProgress({
          userId,
          lessonId,
          progress: progressData.progress || 0,
          timeSpent: progressData.timeSpent || 0,
          sectionsCompleted: progressData.sectionsCompleted || [],
          lastAccessedAt: new Date(),
        });
        await progress.save();
        return progress.toObject();
      }
    } catch (error) {
      console.error("Error updating lesson progress:", error);
      throw new Error("Failed to update lesson progress");
    }
  }

  /**
   * Get user's lesson progress
   */
  public async getLessonProgress(
    userId: string,
    lessonId: string
  ): Promise<IUserLessonProgress | null> {
    try {
      const progress = await UserLessonProgress.findOne({
        userId,
        lessonId,
      }).lean();
      return progress;
    } catch (error) {
      console.error("Error getting lesson progress:", error);
      throw new Error("Failed to get lesson progress");
    }
  }

  /**
   * Get all lesson progress for a user
   */
  public async getUserLessonProgress(
    userId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{ progress: IUserLessonProgress[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [progress, total] = await Promise.all([
        UserLessonProgress.find({ userId })
          .populate("lessonId", "title description duration")
          .sort({ lastAccessedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        UserLessonProgress.countDocuments({ userId }),
      ]);

      return { progress, total };
    } catch (error) {
      console.error("Error getting user lesson progress:", error);
      throw new Error("Failed to get user lesson progress");
    }
  }

  // ========================================
  // QUIZ ATTEMPTS
  // ========================================

  /**
   * Record quiz attempt
   */
  public async recordQuizAttempt(
    userId: string,
    quizQuestionId: string,
    attemptData: {
      answers: Array<{
        questionId: string;
        selectedAnswer: string;
        isCorrect: boolean;
        points: number;
      }>;
      totalQuestions: number;
      timeSpent: number;
    }
  ): Promise<IUserQuizAttempt> {
    try {
      // Get attempt number
      const attemptCount = await UserQuizAttempt.countDocuments({
        userId,
        quizQuestionId,
      });

      const correctAnswers = attemptData.answers.filter(
        (a) => a.isCorrect
      ).length;

      const attempt = new UserQuizAttempt({
        userId,
        quizQuestionId,
        answers: attemptData.answers,
        totalQuestions: attemptData.totalQuestions,
        correctAnswers,
        timeSpent: attemptData.timeSpent,
        attemptNumber: attemptCount + 1,
      });

      await attempt.save();
      return attempt.toObject();
    } catch (error) {
      console.error("Error recording quiz attempt:", error);
      throw new Error("Failed to record quiz attempt");
    }
  }

  /**
   * Get quiz attempts for a user
   */
  public async getQuizAttempts(
    userId: string,
    quizQuestionId?: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{ attempts: IUserQuizAttempt[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const filter: Record<string, unknown> = { userId };
      if (quizQuestionId) filter.quizQuestionId = quizQuestionId;

      const [attempts, total] = await Promise.all([
        UserQuizAttempt.find(filter)
          .populate("quizQuestionId", "title description")
          .sort({ completedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        UserQuizAttempt.countDocuments(filter),
      ]);

      return { attempts, total };
    } catch (error) {
      console.error("Error getting quiz attempts:", error);
      throw new Error("Failed to get quiz attempts");
    }
  }

  // ========================================
  // CODING ATTEMPTS
  // ========================================

  /**
   * Record coding attempt
   */
  public async recordCodingAttempt(
    userId: string,
    codingQuestionId: string,
    attemptData: {
      code: string;
      language: string;
      status: "passed" | "failed" | "timeout" | "error";
      testCasesPassed: number;
      totalTestCases: number;
      timeSpent: number;
      memory?: number;
      runtime?: number;
    }
  ): Promise<IUserCodingAttempt> {
    try {
      // Get attempt number
      const attemptCount = await UserCodingAttempt.countDocuments({
        userId,
        codingQuestionId,
      });

      const attempt = new UserCodingAttempt({
        userId,
        codingQuestionId,
        ...attemptData,
        attemptNumber: attemptCount + 1,
      });

      await attempt.save();
      return attempt.toObject();
    } catch (error) {
      console.error("Error recording coding attempt:", error);
      throw new Error("Failed to record coding attempt");
    }
  }

  /**
   * Get coding attempts for a user
   */
  public async getCodingAttempts(
    userId: string,
    codingQuestionId?: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{ attempts: IUserCodingAttempt[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const filter: Record<string, unknown> = { userId };
      if (codingQuestionId) filter.codingQuestionId = codingQuestionId;

      const [attempts, total] = await Promise.all([
        UserCodingAttempt.find(filter)
          .populate("codingQuestionId", "title description language")
          .sort({ submittedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        UserCodingAttempt.countDocuments(filter),
      ]);

      return { attempts, total };
    } catch (error) {
      console.error("Error getting coding attempts:", error);
      throw new Error("Failed to get coding attempts");
    }
  }

  // ========================================
  // PUZZLE ATTEMPTS
  // ========================================

  /**
   * Record puzzle attempt
   */
  public async recordPuzzleAttempt(
    userId: string,
    puzzleId: string,
    attemptData: {
      solution: string;
      status: "solved" | "attempted" | "failed";
      timeSpent: number;
      hintsUsed: number;
      points: number;
    }
  ): Promise<IUserPuzzleAttempt> {
    try {
      // Get attempt number
      const attemptCount = await UserPuzzleAttempt.countDocuments({
        userId,
        puzzleId,
      });

      const attempt = new UserPuzzleAttempt({
        userId,
        puzzleId,
        ...attemptData,
        attemptNumber: attemptCount + 1,
      });

      await attempt.save();
      return attempt.toObject();
    } catch (error) {
      console.error("Error recording puzzle attempt:", error);
      throw new Error("Failed to record puzzle attempt");
    }
  }

  /**
   * Get puzzle attempts for a user
   */
  public async getPuzzleAttempts(
    userId: string,
    puzzleId?: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{ attempts: IUserPuzzleAttempt[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const filter: Record<string, unknown> = { userId };
      if (puzzleId) filter.puzzleId = puzzleId;

      const [attempts, total] = await Promise.all([
        UserPuzzleAttempt.find(filter)
          .populate("puzzleId", "title description type")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        UserPuzzleAttempt.countDocuments(filter),
      ]);

      return { attempts, total };
    } catch (error) {
      console.error("Error getting puzzle attempts:", error);
      throw new Error("Failed to get puzzle attempts");
    }
  }

  // ========================================
  // BOOKMARKS
  // ========================================

  /**
   * Add bookmark
   */
  public async addBookmark(
    userId: string,
    resourceType:
      | "lesson"
      | "question"
      | "coding"
      | "quiz"
      | "puzzle"
      | "subject",
    resourceId: string,
    title: string,
    notes?: string
  ): Promise<IUserBookmark> {
    try {
      const bookmark = new UserBookmark({
        userId,
        resourceType,
        resourceId,
        title,
        notes,
      });

      await bookmark.save();
      return bookmark.toObject();
    } catch (error) {
      console.error("Error adding bookmark:", error);
      throw new Error("Failed to add bookmark");
    }
  }

  /**
   * Remove bookmark
   */
  public async removeBookmark(
    userId: string,
    resourceType: string,
    resourceId: string
  ): Promise<void> {
    try {
      await UserBookmark.findOneAndDelete({
        userId,
        resourceType,
        resourceId,
      });
    } catch (error) {
      console.error("Error removing bookmark:", error);
      throw new Error("Failed to remove bookmark");
    }
  }

  /**
   * Get user bookmarks
   */
  public async getUserBookmarks(
    userId: string,
    resourceType?: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{ bookmarks: IUserBookmark[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const filter: Record<string, unknown> = { userId };
      if (resourceType) filter.resourceType = resourceType;

      const [bookmarks, total] = await Promise.all([
        UserBookmark.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        UserBookmark.countDocuments(filter),
      ]);

      return { bookmarks, total };
    } catch (error) {
      console.error("Error getting bookmarks:", error);
      throw new Error("Failed to get bookmarks");
    }
  }

  // ========================================
  // SUBJECT ENROLLMENT
  // ========================================

  /**
   * Enroll user in subject
   */
  public async enrollInSubject(
    userId: string,
    subjectId: string,
    totalLessons: number = 0,
    totalQuizzes: number = 0
  ): Promise<IUserSubjectEnrollment> {
    try {
      const enrollment = new UserSubjectEnrollment({
        userId,
        subjectId,
        totalLessons,
        totalQuizzes,
      });

      await enrollment.save();
      return enrollment.toObject();
    } catch (error) {
      console.error("Error enrolling in subject:", error);
      throw new Error("Failed to enroll in subject");
    }
  }

  /**
   * Update subject enrollment progress
   */
  public async updateEnrollmentProgress(
    userId: string,
    subjectId: string,
    updateData: {
      lessonsCompleted?: number;
      quizzesCompleted?: number;
    }
  ): Promise<IUserSubjectEnrollment> {
    try {
      const enrollment = await UserSubjectEnrollment.findOne({
        userId,
        subjectId,
      });

      if (!enrollment) {
        throw new Error("Enrollment not found");
      }

      if (updateData.lessonsCompleted !== undefined) {
        enrollment.lessonsCompleted = updateData.lessonsCompleted;
      }
      if (updateData.quizzesCompleted !== undefined) {
        enrollment.quizzesCompleted = updateData.quizzesCompleted;
      }

      enrollment.lastAccessedAt = new Date();
      await enrollment.save();
      return enrollment.toObject();
    } catch (error) {
      console.error("Error updating enrollment progress:", error);
      throw new Error("Failed to update enrollment progress");
    }
  }

  /**
   * Get user enrollments
   */
  public async getUserEnrollments(
    userId: string,
    status?: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{ enrollments: IUserSubjectEnrollment[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const filter: Record<string, unknown> = { userId };
      if (status) filter.status = status;

      const [enrollments, total] = await Promise.all([
        UserSubjectEnrollment.find(filter)
          .populate("subjectId", "title description icon color difficulty")
          .sort({ lastAccessedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        UserSubjectEnrollment.countDocuments(filter),
      ]);

      return { enrollments, total };
    } catch (error) {
      console.error("Error getting user enrollments:", error);
      throw new Error("Failed to get user enrollments");
    }
  }

  /**
   * Get enrollment by subject
   */
  public async getEnrollmentBySubject(
    userId: string,
    subjectId: string
  ): Promise<IUserSubjectEnrollment | null> {
    try {
      const enrollment = await UserSubjectEnrollment.findOne({
        userId,
        subjectId,
      })
        .populate("subjectId", "title description icon color")
        .lean();
      return enrollment;
    } catch (error) {
      console.error("Error getting enrollment by subject:", error);
      throw new Error("Failed to get enrollment");
    }
  }

  // ========================================
  // STATISTICS & ANALYTICS
  // ========================================

  /**
   * Get user overall statistics
   */
  public async getUserStatistics(userId: string): Promise<{
    totalLessonsCompleted: number;
    totalQuizzesTaken: number;
    averageQuizScore: number;
    totalCodingSubmissions: number;
    codingSuccessRate: number;
    totalPuzzlesSolved: number;
    totalBookmarks: number;
    totalEnrollments: number;
    activeEnrollments: number;
  }> {
    try {
      const [
        lessonStats,
        quizStats,
        codingStats,
        puzzleStats,
        bookmarkCount,
        enrollmentStats,
      ] = await Promise.all([
        UserLessonProgress.countDocuments({ userId, completed: true }),
        UserQuizAttempt.aggregate([
          { $match: { userId } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              avgScore: { $avg: "$score" },
            },
          },
        ]),
        UserCodingAttempt.aggregate([
          { $match: { userId } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              passed: {
                $sum: { $cond: [{ $eq: ["$status", "passed"] }, 1, 0] },
              },
            },
          },
        ]),
        UserPuzzleAttempt.countDocuments({ userId, status: "solved" }),
        UserBookmark.countDocuments({ userId }),
        UserSubjectEnrollment.aggregate([
          { $match: { userId } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              active: {
                $sum: {
                  $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0],
                },
              },
            },
          },
        ]),
      ]);

      return {
        totalLessonsCompleted: lessonStats,
        totalQuizzesTaken: quizStats[0]?.total || 0,
        averageQuizScore: Math.round(quizStats[0]?.avgScore || 0),
        totalCodingSubmissions: codingStats[0]?.total || 0,
        codingSuccessRate:
          codingStats[0]?.total > 0
            ? Math.round((codingStats[0]?.passed / codingStats[0]?.total) * 100)
            : 0,
        totalPuzzlesSolved: puzzleStats,
        totalBookmarks: bookmarkCount,
        totalEnrollments: enrollmentStats[0]?.total || 0,
        activeEnrollments: enrollmentStats[0]?.active || 0,
      };
    } catch (error) {
      console.error("Error getting user statistics:", error);
      throw new Error("Failed to get user statistics");
    }
  }

  /**
   * Get user dashboard data
   */
  public async getUserDashboard(userId: string): Promise<{
    recentProgress: IUserLessonProgress[];
    recentQuizzes: IUserQuizAttempt[];
    activeEnrollments: IUserSubjectEnrollment[];
    statistics: any;
  }> {
    try {
      const [recentProgress, recentQuizzes, activeEnrollments, statistics] =
        await Promise.all([
          UserLessonProgress.find({ userId })
            .populate("lessonId", "title description")
            .sort({ lastAccessedAt: -1 })
            .limit(5)
            .lean(),
          UserQuizAttempt.find({ userId })
            .populate("quizQuestionId", "title description")
            .sort({ completedAt: -1 })
            .limit(5)
            .lean(),
          UserSubjectEnrollment.find({ userId, status: "in-progress" })
            .populate("subjectId", "title description icon color")
            .sort({ lastAccessedAt: -1 })
            .limit(5)
            .lean(),
          this.getUserStatistics(userId),
        ]);

      return {
        recentProgress,
        recentQuizzes,
        activeEnrollments,
        statistics,
      };
    } catch (error) {
      console.error("Error getting user dashboard:", error);
      throw new Error("Failed to get user dashboard");
    }
  }
}
