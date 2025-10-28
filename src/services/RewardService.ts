import {
  Reward,
  UserReward,
  UserPoints,
  UserLessonProgress,
  UserQuizAttempt,
  UserAttemptedQuestion,
  UserPuzzleAttempt,
  UserCodingAttempt,
  UserSubjectEnrollment,
  RewardPointValues,
} from "../models/index.js";
import type { IReward, IUserReward, IUserPoints } from "../models/index.js";

export class RewardService {
  // Default point values for different activities (monetary rewards)
  private POINT_VALUES = {
    LESSON_COMPLETED: 1, // ₹1.00 per lesson
    QUIZ_QUESTION_CORRECT: 0.5, // ₹0.50 per correct answer
    QUIZ_QUESTION_WRONG: 0.1, // ₹0.10 participation
    QUIZ_PERFECT_SCORE: 2, // ₹2.00 bonus for 100% accuracy
    PUZZLE_SOLVED: 1.5, // ₹1.50 per puzzle
    CODING_PROBLEM_SOLVED: 2.5, // ₹2.50 per problem
    CODING_PROBLEM_PERFECT: 4, // ₹4.00 for perfect solution
    STREAK_DAY_BONUS: 0.5, // ₹0.50 per streak day
    SUBJECT_ENROLLED: 0.5, // ₹0.50 per enrollment
    ACHIEVEMENT_EARNED: 5, // ₹5.00 base for achievements
  };

  constructor() {
    this.loadPointValues();
  }

  /**
   * Load point values from database
   */
  private async loadPointValues() {
    try {
      const config = await RewardPointValues.findOne().lean();
      if (config) {
        this.POINT_VALUES = {
          LESSON_COMPLETED: config.LESSON_COMPLETED,
          QUIZ_QUESTION_CORRECT: config.QUIZ_QUESTION_CORRECT,
          QUIZ_QUESTION_WRONG: config.QUIZ_QUESTION_WRONG,
          QUIZ_PERFECT_SCORE: config.QUIZ_PERFECT_SCORE,
          PUZZLE_SOLVED: config.PUZZLE_SOLVED,
          CODING_PROBLEM_SOLVED: config.CODING_PROBLEM_SOLVED,
          CODING_PROBLEM_PERFECT: config.CODING_PROBLEM_PERFECT,
          STREAK_DAY_BONUS: config.STREAK_DAY_BONUS,
          SUBJECT_ENROLLED: config.SUBJECT_ENROLLED,
          ACHIEVEMENT_EARNED: config.ACHIEVEMENT_EARNED,
        };
      }
    } catch (error) {
      console.error("Error loading point values:", error);
    }
  }

  /**
   * Award points for an activity
   */
  public async awardPoints(
    userId: string,
    activityType:
      | "lesson_completed"
      | "quiz_completed"
      | "puzzle_solved"
      | "coding_solved"
      | "subject_enrolled"
      | "achievement_earned"
      | "streak_bonus",
    metadata?: {
      points?: number;
      correctAnswers?: number;
      totalQuestions?: number;
      accuracy?: number;
      streakDays?: number;
      subjectId?: string;
      [key: string]: any;
    }
  ): Promise<{ points: number; userPoints: IUserPoints; levelUp: boolean }> {
    try {
      let pointsEarned = 0;

      // Calculate points based on activity type
      switch (activityType) {
        case "lesson_completed":
          pointsEarned = this.POINT_VALUES.LESSON_COMPLETED;
          break;

        case "quiz_completed":
          if (metadata?.correctAnswers && metadata?.totalQuestions) {
            pointsEarned =
              metadata.correctAnswers *
                this.POINT_VALUES.QUIZ_QUESTION_CORRECT +
              (metadata.totalQuestions - metadata.correctAnswers) *
                this.POINT_VALUES.QUIZ_QUESTION_WRONG;

            // Bonus for perfect score (only for multi-question quizzes)
            if (
              metadata.correctAnswers === metadata.totalQuestions &&
              metadata.totalQuestions >= 2
            ) {
              pointsEarned += this.POINT_VALUES.QUIZ_PERFECT_SCORE;
            }
          }
          break;

        case "puzzle_solved":
          pointsEarned = this.POINT_VALUES.PUZZLE_SOLVED;
          break;

        case "coding_solved":
          pointsEarned = this.POINT_VALUES.CODING_PROBLEM_SOLVED;
          // Bonus for perfect solution
          if (metadata?.accuracy === 100) {
            pointsEarned = this.POINT_VALUES.CODING_PROBLEM_PERFECT;
          }
          break;

        case "subject_enrolled":
          pointsEarned = this.POINT_VALUES.SUBJECT_ENROLLED;
          break;

        case "achievement_earned":
          pointsEarned =
            metadata?.points || this.POINT_VALUES.ACHIEVEMENT_EARNED;
          break;

        case "streak_bonus":
          pointsEarned =
            (metadata?.streakDays || 0) * this.POINT_VALUES.STREAK_DAY_BONUS;
          break;

        default:
          pointsEarned = metadata?.points || 0;
      }

      // Get or create user points
      let userPoints = await UserPoints.findOne({ userId });
      const previousLevel = userPoints?.currentLevel || 1;

      if (!userPoints) {
        userPoints = new UserPoints({ userId });
      }

      // Update points
      userPoints.totalPoints += pointsEarned;

      // Update breakdown
      switch (activityType) {
        case "lesson_completed":
          userPoints.breakdown.lessonsCompleted += pointsEarned;
          break;
        case "quiz_completed":
          userPoints.breakdown.quizzesCompleted += pointsEarned;
          break;
        case "puzzle_solved":
          userPoints.breakdown.puzzlesSolved += pointsEarned;
          break;
        case "coding_solved":
          userPoints.breakdown.codingProblems += pointsEarned;
          break;
        case "achievement_earned":
          userPoints.breakdown.achievements += pointsEarned;
          break;
        default:
          userPoints.breakdown.bonuses += pointsEarned;
      }

      // Update streak
      await this.updateStreak(userId, userPoints);

      await userPoints.save();

      const levelUp = userPoints.currentLevel > previousLevel;

      console.log(
        `[awardPoints] User ${userId} earned ${pointsEarned} points for ${activityType}. Total: ${
          userPoints.totalPoints
        }, Level: ${userPoints.currentLevel}${levelUp ? " (LEVEL UP!)" : ""}`
      );

      // Check for new achievements
      await this.checkAndAwardAchievements(userId);

      return {
        points: pointsEarned,
        userPoints: userPoints.toObject(),
        levelUp,
      };
    } catch (error) {
      console.error("Error awarding points:", error);
      throw new Error("Failed to award points");
    }
  }

  /**
   * Update user's streak
   */
  private async updateStreak(
    userId: string,
    userPoints: IUserPoints
  ): Promise<void> {
    const now = new Date();
    const lastActivity = userPoints.lastActivityDate;

    if (!lastActivity) {
      userPoints.currentStreak = 1;
      userPoints.longestStreak = 1;
      userPoints.lastActivityDate = now;
      return;
    }

    const daysSinceLastActivity = Math.floor(
      (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastActivity === 0) {
      // Same day, no change
      return;
    } else if (daysSinceLastActivity === 1) {
      // Consecutive day
      userPoints.currentStreak += 1;
      if (userPoints.currentStreak > userPoints.longestStreak) {
        userPoints.longestStreak = userPoints.currentStreak;
      }
    } else {
      // Streak broken
      userPoints.currentStreak = 1;
    }

    userPoints.lastActivityDate = now;
  }

  /**
   * Get user's points and stats
   */
  public async getUserPoints(userId: string): Promise<IUserPoints | null> {
    try {
      let userPoints = await UserPoints.findOne({ userId });

      if (!userPoints) {
        userPoints = new UserPoints({ userId });
        await userPoints.save();
      }

      return userPoints.toObject();
    } catch (error) {
      console.error("Error getting user points:", error);
      throw new Error("Failed to get user points");
    }
  }

  /**
   * Get leaderboard
   */
  public async getLeaderboard(
    limit: number = 100,
    tier?: "bronze" | "silver" | "gold" | "platinum" | "diamond"
  ): Promise<IUserPoints[]> {
    try {
      const query = tier ? { tier } : {};

      const leaderboard = await UserPoints.find(query)
        .sort({ totalPoints: -1 })
        .limit(limit)
        .lean();

      return leaderboard as unknown as IUserPoints[];
    } catch (error) {
      console.error("Error getting leaderboard:", error);
      throw new Error("Failed to get leaderboard");
    }
  }

  /**
   * Check and award achievements
   */
  public async checkAndAwardAchievements(
    userId: string
  ): Promise<IUserReward[]> {
    try {
      const newRewards: IUserReward[] = [];

      // Get all active rewards
      const rewards = await Reward.find({ isActive: true }).lean();

      // Get user stats
      const [
        lessonsCompleted,
        quizzesCompleted,
        attemptedQuestions,
        userPoints,
      ] = await Promise.all([
        UserLessonProgress.countDocuments({ userId, completed: true }),
        UserQuizAttempt.countDocuments({ userId }),
        UserAttemptedQuestion.find({ userId }).lean(),
        UserPoints.findOne({ userId }),
      ]);

      const correctAnswers = attemptedQuestions.filter(
        (q) => q.isCorrect
      ).length;
      const accuracy =
        attemptedQuestions.length > 0
          ? (correctAnswers / attemptedQuestions.length) * 100
          : 0;

      // Check each reward
      for (const reward of rewards) {
        // Check if user already has this reward (and if it's not repeatable)
        const existingReward = await UserReward.findOne({
          userId,
          rewardId: reward._id.toString(),
        });

        if (existingReward && !reward.isRepeatable) {
          continue; // Already earned and not repeatable
        }

        let earned = false;

        // Check criteria
        switch (reward.criteria.type) {
          case "lessons_completed":
            earned = lessonsCompleted >= reward.criteria.target;
            break;

          case "quizzes_completed":
            earned = quizzesCompleted >= reward.criteria.target;
            break;

          case "correct_answers":
            earned = correctAnswers >= reward.criteria.target;
            break;

          case "streak_days":
            earned = (userPoints?.currentStreak || 0) >= reward.criteria.target;
            break;

          case "subjects_enrolled":
            const enrolledCount = await UserSubjectEnrollment.countDocuments({
              userId,
            });
            earned = enrolledCount >= reward.criteria.target;
            break;

          case "accuracy_threshold":
            earned = accuracy >= reward.criteria.target;
            break;

          case "puzzles_solved":
            const puzzlesSolved = await UserPuzzleAttempt.countDocuments({
              userId,
              status: "completed",
            });
            earned = puzzlesSolved >= reward.criteria.target;
            break;

          case "coding_problems":
            const codingProblems = await UserCodingAttempt.countDocuments({
              userId,
              status: "passed",
            });
            earned = codingProblems >= reward.criteria.target;
            break;
        }

        if (earned) {
          // Award the reward
          if (existingReward) {
            // Update repeatable reward
            existingReward.timesEarned += 1;
            existingReward.earnedAt = new Date();
            await existingReward.save();
            newRewards.push(existingReward.toObject());
          } else {
            // Create new reward
            const userReward = new UserReward({
              userId,
              rewardId: reward._id.toString(),
              earnedAt: new Date(),
              metadata: {
                lessonsCompleted,
                quizzesCompleted,
                accuracy,
                streakDays: userPoints?.currentStreak || 0,
              },
            });
            await userReward.save();
            newRewards.push(userReward.toObject());

            // Award points for achievement
            await this.awardPoints(userId, "achievement_earned", {
              points: reward.points,
            });

            // Update reward counts
            if (userPoints) {
              switch (reward.type) {
                case "badge":
                  userPoints.rewardCounts.badges += 1;
                  break;
                case "achievement":
                  userPoints.rewardCounts.achievements += 1;
                  break;
                case "milestone":
                  userPoints.rewardCounts.milestones += 1;
                  break;
              }
              await userPoints.save();
            }

            console.log(
              `[checkAndAwardAchievements] User ${userId} earned reward: ${reward.name}`
            );
          }
        }
      }

      return newRewards;
    } catch (error) {
      console.error("Error checking achievements:", error);
      throw new Error("Failed to check achievements");
    }
  }

  /**
   * Get user's rewards
   */
  public async getUserRewards(
    userId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{ rewards: any[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [userRewards, total] = await Promise.all([
        UserReward.find({ userId })
          .sort({ earnedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        UserReward.countDocuments({ userId }),
      ]);

      // Populate reward details
      const rewardIds = userRewards.map((r) => r.rewardId);
      const rewards = await Reward.find({ _id: { $in: rewardIds } }).lean();

      const rewardMap = new Map(rewards.map((r) => [r._id.toString(), r]));

      const populatedRewards = userRewards.map((ur) => ({
        ...ur,
        reward: rewardMap.get(ur.rewardId),
      }));

      return {
        rewards: populatedRewards,
        total,
      };
    } catch (error) {
      console.error("Error getting user rewards:", error);
      throw new Error("Failed to get user rewards");
    }
  }

  /**
   * Get all available rewards
   */
  public async getAllRewards(
    category?: string,
    tier?: string
  ): Promise<IReward[]> {
    try {
      const query: any = { isActive: true };
      if (category) query.category = category;
      if (tier) query.tier = tier;

      const rewards = await Reward.find(query)
        .sort({ tier: 1, points: 1 })
        .lean();

      return rewards as unknown as IReward[];
    } catch (error) {
      console.error("Error getting all rewards:", error);
      throw new Error("Failed to get rewards");
    }
  }

  // ==================== ADMIN METHODS ====================

  /**
   * Get reward by ID
   */
  public async getRewardById(rewardId: string): Promise<IReward | null> {
    try {
      const reward = await Reward.findById(rewardId).lean();
      return reward as unknown as IReward | null;
    } catch (error) {
      console.error("Error getting reward by ID:", error);
      throw new Error("Failed to get reward");
    }
  }

  /**
   * Create a new reward
   */
  public async createReward(rewardData: Partial<IReward>): Promise<IReward> {
    try {
      const reward = new Reward(rewardData);
      await reward.save();
      return reward.toObject() as unknown as IReward;
    } catch (error) {
      console.error("Error creating reward:", error);
      throw new Error("Failed to create reward");
    }
  }

  /**
   * Update a reward
   */
  public async updateReward(
    rewardId: string,
    updateData: Partial<IReward>
  ): Promise<IReward | null> {
    try {
      const reward = await Reward.findByIdAndUpdate(rewardId, updateData, {
        new: true,
      }).lean();
      return reward as unknown as IReward | null;
    } catch (error) {
      console.error("Error updating reward:", error);
      throw new Error("Failed to update reward");
    }
  }

  /**
   * Delete a reward
   */
  public async deleteReward(rewardId: string): Promise<void> {
    try {
      await Reward.findByIdAndDelete(rewardId);
    } catch (error) {
      console.error("Error deleting reward:", error);
      throw new Error("Failed to delete reward");
    }
  }

  /**
   * Get all user points (paginated)
   */
  public async getAllUserPoints(
    page: number = 1,
    limit: number = 50,
    tier?: string
  ): Promise<{ userPoints: IUserPoints[]; total: number }> {
    try {
      const query: any = {};
      if (tier) query.tier = tier;

      const skip = (page - 1) * limit;

      const [userPoints, total] = await Promise.all([
        UserPoints.find(query)
          .sort({ totalPoints: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        UserPoints.countDocuments(query),
      ]);

      return {
        userPoints: userPoints as unknown as IUserPoints[],
        total,
      };
    } catch (error) {
      console.error("Error getting all user points:", error);
      throw new Error("Failed to get user points");
    }
  }

  /**
   * Get current point values
   */
  public getPointValues() {
    return { ...this.POINT_VALUES };
  }

  /**
   * Update point values
   */
  public async updatePointValues(newValues: Partial<typeof this.POINT_VALUES>) {
    try {
      // Update or create configuration in database
      let config = await RewardPointValues.findOne();

      if (!config) {
        config = new RewardPointValues(newValues);
      } else {
        Object.assign(config, newValues);
      }

      await config.save();

      // Reload point values
      await this.loadPointValues();

      return this.POINT_VALUES;
    } catch (error) {
      console.error("Error updating point values:", error);
      throw new Error("Failed to update point values");
    }
  }
}
