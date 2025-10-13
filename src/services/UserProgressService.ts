import {
  UserLessonProgress,
  UserQuizAttempt,
  UserCodingAttempt,
  UserPuzzleAttempt,
  UserBookmark,
  UserSubjectEnrollment,
  UserAttemptedQuestion,
} from "../models/index.js";
import type {
  IUserLessonProgress,
  IUserQuizAttempt,
  IUserCodingAttempt,
  IUserPuzzleAttempt,
  IUserBookmark,
  IUserSubjectEnrollment,
  IUserAttemptedQuestion,
} from "../models/index.js";
import { RewardService } from "./RewardService.js";

export class UserProgressService {
  private rewardService: RewardService;

  constructor() {
    this.rewardService = new RewardService();
  }

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
      completed?: boolean;
    }
  ): Promise<IUserLessonProgress> {
    try {
      const existingProgress = await UserLessonProgress.findOne({
        userId,
        lessonId,
      });

      if (existingProgress) {
        // Update existing
        const wasCompleted = existingProgress.completed;

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
        if (progressData.completed !== undefined) {
          existingProgress.completed = progressData.completed;
          if (progressData.completed && !existingProgress.completedAt) {
            existingProgress.completedAt = new Date();

            // Award points for lesson completion (only if not previously completed)
            if (!wasCompleted) {
              await this.rewardService.awardPoints(userId, "lesson_completed");
            }
          }
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
          completed: progressData.completed || false,
          completedAt: progressData.completed ? new Date() : undefined,
          lastAccessedAt: new Date(),
        });
        await progress.save();

        // Award points if completed immediately
        if (progressData.completed) {
          await this.rewardService.awardPoints(userId, "lesson_completed");
        }

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
      return progress as any;
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
  ): Promise<{ progress: any[]; total: number }> {
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

      return { progress: progress as any, total };
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

      // Record each individual question as attempted
      for (const answer of attemptData.answers) {
        await this.recordAttemptedQuestion(userId, {
          questionId: answer.questionId,
          questionType: "quiz",
          isCorrect: answer.isCorrect,
          selectedAnswer: answer.selectedAnswer,
          points: answer.points,
          timeSpent: Math.round(
            attemptData.timeSpent / attemptData.answers.length
          ), // Distribute time across questions
        });
      }

      // Award points for quiz completion
      const accuracy = (correctAnswers / attemptData.totalQuestions) * 100;
      await this.rewardService.awardPoints(userId, "quiz_completed", {
        correctAnswers,
        totalQuestions: attemptData.totalQuestions,
        accuracy,
      });

      console.log(
        `[recordQuizAttempt] Recorded quiz attempt for user ${userId}, quiz ${quizQuestionId}: ${correctAnswers}/${attemptData.totalQuestions} correct`
      );

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
  ): Promise<{ attempts: any[]; total: number }> {
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

      return { attempts: attempts as any, total };
    } catch (error) {
      console.error("Error getting quiz attempts:", error);
      throw new Error("Failed to get quiz attempts");
    }
  }

  /**
   * Get attempted question IDs for a user
   */
  public async getAttemptedQuestionIds(userId: string): Promise<string[]> {
    try {
      const attemptedQuestions = await UserAttemptedQuestion.find(
        { userId },
        { questionId: 1, _id: 0 }
      ).lean();

      const result = attemptedQuestions.map((q) => q.questionId);

      console.log(
        `[getAttemptedQuestionIds] Found ${result.length} attempted questions for user ${userId}:`,
        result
      );

      return result;
    } catch (error) {
      console.error("Error getting attempted question IDs:", error);
      throw new Error("Failed to get attempted question IDs");
    }
  }

  /**
   * Record an attempted question
   */
  public async recordAttemptedQuestion(
    userId: string,
    questionData: {
      questionId: string;
      questionType: "quiz" | "interview" | "coding" | "puzzle";
      subjectId?: string;
      moduleId?: string;
      lessonId?: string;
      categoryId?: string;
      difficulty?:
        | "Easy"
        | "Medium"
        | "Hard"
        | "Beginner"
        | "Intermediate"
        | "Advanced"
        | "Expert";
      isCorrect: boolean;
      selectedAnswer?: string;
      points: number;
      timeSpent: number;
    }
  ): Promise<IUserAttemptedQuestion> {
    try {
      // Use upsert to handle potential duplicates
      const attemptedQuestion = await UserAttemptedQuestion.findOneAndUpdate(
        { userId, questionId: questionData.questionId },
        {
          userId,
          questionId: questionData.questionId,
          questionType: questionData.questionType,
          subjectId: questionData.subjectId,
          moduleId: questionData.moduleId,
          lessonId: questionData.lessonId,
          categoryId: questionData.categoryId,
          difficulty: questionData.difficulty,
          isCorrect: questionData.isCorrect,
          selectedAnswer: questionData.selectedAnswer,
          points: questionData.points,
          timeSpent: questionData.timeSpent,
          attemptedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      console.log(
        `[recordAttemptedQuestion] Recorded attempt for user ${userId}, question ${questionData.questionId}, correct: ${questionData.isCorrect}`
      );

      return attemptedQuestion.toObject();
    } catch (error) {
      console.error("Error recording attempted question:", error);
      throw new Error("Failed to record attempted question");
    }
  }

  /**
   * Get attempted questions by type
   */
  public async getAttemptedQuestionsByType(
    userId: string,
    questionType: "quiz" | "interview" | "coding" | "puzzle"
  ): Promise<IUserAttemptedQuestion[]> {
    try {
      const attemptedQuestions = await UserAttemptedQuestion.find({
        userId,
        questionType,
      })
        .sort({ attemptedAt: -1 })
        .lean();

      console.log(
        `[getAttemptedQuestionsByType] Found ${attemptedQuestions.length} ${questionType} attempts for user ${userId}`
      );

      return attemptedQuestions as unknown as IUserAttemptedQuestion[];
    } catch (error) {
      console.error("Error getting attempted questions by type:", error);
      throw new Error("Failed to get attempted questions by type");
    }
  }

  /**
   * Get attempted questions statistics
   */
  public async getAttemptedQuestionsStats(userId: string): Promise<{
    totalAttempted: number;
    totalCorrect: number;
    accuracy: number;
    byType: {
      quiz: { attempted: number; correct: number; accuracy: number };
      interview: { attempted: number; correct: number; accuracy: number };
      coding: { attempted: number; correct: number; accuracy: number };
      puzzle: { attempted: number; correct: number; accuracy: number };
    };
  }> {
    try {
      const stats = await UserAttemptedQuestion.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: "$questionType",
            attempted: { $sum: 1 },
            correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
          },
        },
      ]);

      const byType = {
        quiz: { attempted: 0, correct: 0, accuracy: 0 },
        interview: { attempted: 0, correct: 0, accuracy: 0 },
        coding: { attempted: 0, correct: 0, accuracy: 0 },
        puzzle: { attempted: 0, correct: 0, accuracy: 0 },
      };

      let totalAttempted = 0;
      let totalCorrect = 0;

      stats.forEach((stat) => {
        const type = stat._id as keyof typeof byType;
        if (byType[type]) {
          byType[type].attempted = stat.attempted;
          byType[type].correct = stat.correct;
          byType[type].accuracy =
            stat.attempted > 0
              ? Math.round((stat.correct / stat.attempted) * 100)
              : 0;

          totalAttempted += stat.attempted;
          totalCorrect += stat.correct;
        }
      });

      const accuracy =
        totalAttempted > 0
          ? Math.round((totalCorrect / totalAttempted) * 100)
          : 0;

      console.log(
        `[getAttemptedQuestionsStats] Stats for user ${userId}: ${totalAttempted} attempted, ${totalCorrect} correct, ${accuracy}% accuracy`
      );

      return {
        totalAttempted,
        totalCorrect,
        accuracy,
        byType,
      };
    } catch (error) {
      console.error("Error getting attempted questions stats:", error);
      throw new Error("Failed to get attempted questions stats");
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
  ): Promise<{ attempts: any[]; total: number }> {
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

      return { attempts: attempts as any, total };
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
  ): Promise<{ attempts: any[]; total: number }> {
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

      return { attempts: attempts as any, total };
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
  ): Promise<{ bookmarks: any[]; total: number }> {
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

      return { bookmarks: bookmarks as any, total };
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
  ): Promise<{ enrollments: any[]; total: number }> {
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

      return { enrollments: enrollments as any, total };
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
      return enrollment as any;
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
    recentProgress: any[];
    recentQuizzes: any[];
    activeEnrollments: any[];
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
        recentProgress: recentProgress as any,
        recentQuizzes: recentQuizzes as any,
        activeEnrollments: activeEnrollments as any,
        statistics,
      };
    } catch (error) {
      console.error("Error getting user dashboard:", error);
      throw new Error("Failed to get user dashboard");
    }
  }

  /**
   * Get today's progress statistics
   */
  public async getTodayProgressStatistics(userId: string): Promise<{
    lessonsCompletedToday: number;
    questionsAnsweredToday: number;
    accuracyToday: number;
    studyTimeToday: number; // in minutes
  }> {
    try {
      // Get start of today and end of today
      const today = new Date();
      const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      console.log(
        `[getTodayProgressStatistics] Calculating stats for ${userId} between ${startOfToday.toISOString()} and ${endOfToday.toISOString()}`
      );

      const [lessonsCompletedToday, quizAttemptsToday, studyTimeToday] =
        await Promise.all([
          // Lessons completed today
          UserLessonProgress.countDocuments({
            userId,
            completed: true,
            completedAt: {
              $gte: startOfToday,
              $lt: endOfToday,
            },
          }),
          // Quiz attempts today
          UserQuizAttempt.aggregate([
            {
              $match: {
                userId,
                completedAt: {
                  $gte: startOfToday,
                  $lt: endOfToday,
                },
              },
            },
            {
              $group: {
                _id: null,
                totalQuestions: { $sum: "$totalQuestions" },
                correctAnswers: { $sum: "$correctAnswers" },
                totalTime: { $sum: "$timeSpent" },
              },
            },
          ]),
          // Study time today (from lesson progress)
          UserLessonProgress.aggregate([
            {
              $match: {
                userId,
                lastAccessedAt: {
                  $gte: startOfToday,
                  $lt: endOfToday,
                },
              },
            },
            {
              $group: {
                _id: null,
                totalTime: { $sum: "$timeSpent" },
              },
            },
          ]),
        ]);

      // Process quiz data
      const quizData = quizAttemptsToday[0] || {
        totalQuestions: 0,
        correctAnswers: 0,
        totalTime: 0,
      };
      const studyTimeData = studyTimeToday[0] || { totalTime: 0 };

      // Calculate accuracy
      const accuracyToday =
        quizData.totalQuestions > 0
          ? Math.round(
              (quizData.correctAnswers / quizData.totalQuestions) * 100
            )
          : 0;

      const result = {
        lessonsCompletedToday,
        questionsAnsweredToday: quizData.totalQuestions,
        accuracyToday,
        studyTimeToday: Math.round(
          studyTimeData.totalTime + quizData.totalTime
        ), // Convert to minutes
      };

      console.log(`[getTodayProgressStatistics] Result for ${userId}:`, result);

      return result;
    } catch (error) {
      console.error("Error getting today's progress statistics:", error);
      throw new Error("Failed to get today's progress statistics");
    }
  }
}
