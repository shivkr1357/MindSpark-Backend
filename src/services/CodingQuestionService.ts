import { CodingQuestion, ICodingQuestion } from "../models/index.js";
import { Types } from "mongoose";

export class CodingQuestionService {
  // Get all coding questions with optional filtering
  static async getAllCodingQuestions(filters: any = {}) {
    try {
      const query: any = { isActive: true };

      // Apply filters
      if (filters.difficulty) {
        query.difficulty = filters.difficulty;
      }
      if (filters.category) {
        query.category = filters.category;
      }
      if (filters.language) {
        query.language = filters.language;
      }
      if (filters.subjectId) {
        query.subjectId = filters.subjectId;
      }
      if (filters.interviewQuestionId) {
        query.interviewQuestionId = filters.interviewQuestionId;
      }

      const codingQuestions = await CodingQuestion.find(query)
        .sort({ createdAt: -1 })
        .limit(filters.limit || 50);

      return {
        success: true,
        data: codingQuestions,
        count: codingQuestions.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch coding questions: ${error}`);
    }
  }

  // Get a single coding question by ID
  static async getCodingQuestionById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid coding question ID");
      }

      const codingQuestion = await CodingQuestion.findOne({
        _id: id,
        isActive: true,
      });

      if (!codingQuestion) {
        throw new Error("Coding question not found");
      }

      return {
        success: true,
        data: codingQuestion,
      };
    } catch (error) {
      throw new Error(`Failed to fetch coding question: ${error}`);
    }
  }

  // Create a new coding question
  static async createCodingQuestion(codingQuestionData: Partial<ICodingQuestion>) {
    try {
      const codingQuestion = new CodingQuestion(codingQuestionData);
      await codingQuestion.save();

      return {
        success: true,
        data: codingQuestion,
      };
    } catch (error) {
      throw new Error(`Failed to create coding question: ${error}`);
    }
  }

  // Update a coding question
  static async updateCodingQuestion(id: string, updateData: Partial<ICodingQuestion>) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid coding question ID");
      }

      const codingQuestion = await CodingQuestion.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!codingQuestion) {
        throw new Error("Coding question not found");
      }

      return {
        success: true,
        data: codingQuestion,
      };
    } catch (error) {
      throw new Error(`Failed to update coding question: ${error}`);
    }
  }

  // Delete a coding question (soft delete)
  static async deleteCodingQuestion(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid coding question ID");
      }

      const codingQuestion = await CodingQuestion.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );

      if (!codingQuestion) {
        throw new Error("Coding question not found");
      }

      return {
        success: true,
        message: "Coding question deleted successfully",
      };
    } catch (error) {
      throw new Error(`Failed to delete coding question: ${error}`);
    }
  }

  // Get coding questions by difficulty
  static async getCodingQuestionsByDifficulty(difficulty: string, limit: number = 10) {
    try {
      const codingQuestions = await CodingQuestion.find({
        difficulty,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .limit(limit);

      return {
        success: true,
        data: codingQuestions,
        count: codingQuestions.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch coding questions by difficulty: ${error}`);
    }
  }

  // Get coding questions by language
  static async getCodingQuestionsByLanguage(language: string, limit: number = 10) {
    try {
      const codingQuestions = await CodingQuestion.find({
        language,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .limit(limit);

      return {
        success: true,
        data: codingQuestions,
        count: codingQuestions.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch coding questions by language: ${error}`);
    }
  }

  // Get coding questions by category
  static async getCodingQuestionsByCategory(category: string, limit: number = 10) {
    try {
      const codingQuestions = await CodingQuestion.find({
        category,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .limit(limit);

      return {
        success: true,
        data: codingQuestions,
        count: codingQuestions.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch coding questions by category: ${error}`);
    }
  }

  // Get public test cases only (for user submission)
  static async getPublicTestCases(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid coding question ID");
      }

      const codingQuestion = await CodingQuestion.findOne({
        _id: id,
        isActive: true,
      }).select('testCases');

      if (!codingQuestion) {
        throw new Error("Coding question not found");
      }

      const publicTestCases = codingQuestion.testCases.filter(testCase => testCase.isPublic);

      return {
        success: true,
        data: publicTestCases,
      };
    } catch (error) {
      throw new Error(`Failed to fetch public test cases: ${error}`);
    }
  }
}
