import { InterviewQuestion } from "../models/InterviewQuestion.js";
import {
  IInterviewQuestion,
  CreateQuestionRequest,
  GetQuestionsQuery,
} from "../types/index.js";

export class QuestionService {
  /**
   * Create a new interview question
   */
  public async createQuestion(
    subjectId: string,
    questionData: CreateQuestionRequest,
    createdBy: string,
  ): Promise<IInterviewQuestion> {
    try {
      const question = new InterviewQuestion({
        ...questionData,
        subjectId,
        createdBy,
      });

      await question.save();
      return question.toObject();
    } catch (error) {
      console.error("Error creating question:", error);
      throw new Error("Failed to create question");
    }
  }

  /**
   * Get questions by subject ID
   */
  public async getQuestionsBySubject(
    subjectId: string,
    query: GetQuestionsQuery = {},
  ): Promise<{ questions: IInterviewQuestion[]; total: number }> {
    try {
      const { difficulty, category, page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      // Build filter
      const filter: Record<string, unknown> = { subjectId };
      if (difficulty) filter.difficulty = difficulty;
      if (category) filter.category = category;

      const [questions, total] = await Promise.all([
        InterviewQuestion.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        InterviewQuestion.countDocuments(filter),
      ]);

      return { questions, total };
    } catch (error) {
      console.error("Error getting questions by subject:", error);
      throw new Error("Failed to get questions");
    }
  }

  /**
   * Get question by ID
   */
  public async getQuestionById(
    questionId: string,
  ): Promise<IInterviewQuestion | null> {
    try {
      const question = await InterviewQuestion.findById(questionId).lean();
      return question;
    } catch (error) {
      console.error("Error getting question by ID:", error);
      throw new Error("Failed to get question");
    }
  }

  /**
   * Update question
   */
  public async updateQuestion(
    questionId: string,
    updateData: Partial<CreateQuestionRequest>,
  ): Promise<IInterviewQuestion> {
    try {
      const question = await InterviewQuestion.findByIdAndUpdate(
        questionId,
        updateData,
        { new: true, runValidators: true },
      );

      if (!question) {
        throw new Error("Question not found");
      }

      return question.toObject();
    } catch (error) {
      console.error("Error updating question:", error);
      throw new Error("Failed to update question");
    }
  }

  /**
   * Delete question
   */
  public async deleteQuestion(questionId: string): Promise<void> {
    try {
      const result = await InterviewQuestion.findByIdAndDelete(questionId);
      if (!result) {
        throw new Error("Question not found");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      throw new Error("Failed to delete question");
    }
  }

  /**
   * Get random questions for practice
   */
  public async getRandomQuestions(
    subjectId: string,
    count: number = 10,
    difficulty?: string,
  ): Promise<IInterviewQuestion[]> {
    try {
      const filter: Record<string, unknown> = { subjectId };
      if (difficulty) filter.difficulty = difficulty;

      const questions = await InterviewQuestion.aggregate([
        { $match: filter },
        { $sample: { size: count } },
      ]);

      return questions;
    } catch (error) {
      console.error("Error getting random questions:", error);
      throw new Error("Failed to get random questions");
    }
  }

  /**
   * Get questions by category
   */
  public async getQuestionsByCategory(
    subjectId: string,
    category: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ questions: IInterviewQuestion[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [questions, total] = await Promise.all([
        InterviewQuestion.find({ subjectId, category })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        InterviewQuestion.countDocuments({ subjectId, category }),
      ]);

      return { questions, total };
    } catch (error) {
      console.error("Error getting questions by category:", error);
      throw new Error("Failed to get questions by category");
    }
  }

  /**
   * Get questions by difficulty
   */
  public async getQuestionsByDifficulty(
    subjectId: string,
    difficulty: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ questions: IInterviewQuestion[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [questions, total] = await Promise.all([
        InterviewQuestion.find({ subjectId, difficulty })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        InterviewQuestion.countDocuments({ subjectId, difficulty }),
      ]);

      return { questions, total };
    } catch (error) {
      console.error("Error getting questions by difficulty:", error);
      throw new Error("Failed to get questions by difficulty");
    }
  }

  /**
   * Get all questions (admin only)
   */
  public async getAllQuestions(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ questions: IInterviewQuestion[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [questions, total] = await Promise.all([
        InterviewQuestion.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        InterviewQuestion.countDocuments(),
      ]);

      return { questions, total };
    } catch (error) {
      console.error("Error getting all questions:", error);
      throw new Error("Failed to get all questions");
    }
  }

  /**
   * Search questions
   */
  public async searchQuestions(
    query: string,
    subjectId?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ questions: IInterviewQuestion[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const searchFilter: Record<string, unknown> = {
        $or: [
          { question: { $regex: query, $options: "i" } },
          { explanation: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      };

      if (subjectId) {
        searchFilter.subjectId = subjectId;
      }

      const [questions, total] = await Promise.all([
        InterviewQuestion.find(searchFilter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        InterviewQuestion.countDocuments(searchFilter),
      ]);

      return { questions, total };
    } catch (error) {
      console.error("Error searching questions:", error);
      throw new Error("Failed to search questions");
    }
  }

  /**
   * Get question statistics
   */
  public async getQuestionStats(subjectId?: string): Promise<{
    totalQuestions: number;
    questionsByDifficulty: Record<string, number>;
    questionsByCategory: Record<string, number>;
  }> {
    try {
      const filter = subjectId ? { subjectId } : {};

      const [totalQuestions, difficultyStats, categoryStats] =
        await Promise.all([
          InterviewQuestion.countDocuments(filter),
          InterviewQuestion.aggregate([
            { $match: filter },
            {
              $group: {
                _id: "$difficulty",
                count: { $sum: 1 },
              },
            },
          ]),
          InterviewQuestion.aggregate([
            { $match: filter },
            {
              $group: {
                _id: "$category",
                count: { $sum: 1 },
              },
            },
          ]),
        ]);

      const questionsByDifficulty = difficultyStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {} as Record<string, number>);

      const questionsByCategory = categoryStats.reduce((acc, stat) => {
        acc[stat._id || "Uncategorized"] = stat.count;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalQuestions,
        questionsByDifficulty,
        questionsByCategory,
      };
    } catch (error) {
      console.error("Error getting question stats:", error);
      throw new Error("Failed to get question statistics");
    }
  }

  /**
   * Get questions created by user
   */
  public async getQuestionsByUser(
    createdBy: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ questions: IInterviewQuestion[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [questions, total] = await Promise.all([
        InterviewQuestion.find({ createdBy })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        InterviewQuestion.countDocuments({ createdBy }),
      ]);

      return { questions, total };
    } catch (error) {
      console.error("Error getting questions by user:", error);
      throw new Error("Failed to get questions by user");
    }
  }
}
