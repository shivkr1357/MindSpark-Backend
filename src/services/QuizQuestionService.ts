import { QuizQuestion, IQuizQuestion } from "../models/index.js";
import { Types } from "mongoose";

export class QuizQuestionService {
  // Get all quiz questions with optional filtering
  static async getAllQuizQuestions(filters: any = {}) {
    try {
      const query: any = { isActive: true };

      // Apply filters
      if (filters.category) {
        query.category = filters.category;
      }
      if (filters.difficulty) {
        query.difficulty = filters.difficulty;
      }
      if (filters.subjectId) {
        query.subjectId = filters.subjectId;
      }
      if (filters.funContentId) {
        query.funContentId = filters.funContentId;
      }

      const quizQuestions = await QuizQuestion.find(query)
        .sort({ createdAt: -1 })
        .limit(filters.limit || 50);

      return {
        success: true,
        data: quizQuestions,
        count: quizQuestions.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch quiz questions: ${error}`);
    }
  }

  // Get a single quiz question by ID
  static async getQuizQuestionById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid quiz question ID");
      }

      const quizQuestion = await QuizQuestion.findOne({
        _id: id,
        isActive: true,
      });

      if (!quizQuestion) {
        throw new Error("Quiz question not found");
      }

      return {
        success: true,
        data: quizQuestion,
      };
    } catch (error) {
      throw new Error(`Failed to fetch quiz question: ${error}`);
    }
  }

  // Create a new quiz question
  static async createQuizQuestion(quizQuestionData: Partial<IQuizQuestion>) {
    try {
      const quizQuestion = new QuizQuestion(quizQuestionData);
      await quizQuestion.save();

      return {
        success: true,
        data: quizQuestion,
      };
    } catch (error) {
      throw new Error(`Failed to create quiz question: ${error}`);
    }
  }

  // Update a quiz question
  static async updateQuizQuestion(id: string, updateData: Partial<IQuizQuestion>) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid quiz question ID");
      }

      const quizQuestion = await QuizQuestion.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!quizQuestion) {
        throw new Error("Quiz question not found");
      }

      return {
        success: true,
        data: quizQuestion,
      };
    } catch (error) {
      throw new Error(`Failed to update quiz question: ${error}`);
    }
  }

  // Delete a quiz question (soft delete)
  static async deleteQuizQuestion(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid quiz question ID");
      }

      const quizQuestion = await QuizQuestion.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );

      if (!quizQuestion) {
        throw new Error("Quiz question not found");
      }

      return {
        success: true,
        message: "Quiz question deleted successfully",
      };
    } catch (error) {
      throw new Error(`Failed to delete quiz question: ${error}`);
    }
  }

  // Get quiz questions by category
  static async getQuizQuestionsByCategory(category: string, limit: number = 10) {
    try {
      const quizQuestions = await QuizQuestion.find({
        category,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .limit(limit);

      return {
        success: true,
        data: quizQuestions,
        count: quizQuestions.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch quiz questions by category: ${error}`);
    }
  }

  // Get quiz questions by difficulty
  static async getQuizQuestionsByDifficulty(difficulty: string, limit: number = 10) {
    try {
      const quizQuestions = await QuizQuestion.find({
        difficulty,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .limit(limit);

      return {
        success: true,
        data: quizQuestions,
        count: quizQuestions.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch quiz questions by difficulty: ${error}`);
    }
  }
}
