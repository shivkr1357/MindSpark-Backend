import { Request, Response } from "express";
import { QuizQuestionService } from "../services/QuizQuestionService.js";
import { validateRequest } from "../middleware/validation.js";

export class QuizQuestionController {
  // Get all quiz questions
  static async getAllQuizQuestions(req: Request, res: Response) {
    try {
      const filters = {
        category: req.query.category as string,
        difficulty: req.query.difficulty as string,
        subjectId: req.query.subjectId as string,
        funContentId: req.query.funContentId as string,
        limit: parseInt(req.query.limit as string) || 50,
      };

      const result = await QuizQuestionService.getAllQuizQuestions(filters);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get quiz question by ID
  static async getQuizQuestionById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await QuizQuestionService.getQuizQuestionById(id);

      res.status(200).json(result);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Create new quiz question
  static async createQuizQuestion(req: Request, res: Response) {
    try {
      const quizQuestionData = req.body;

      const result = await QuizQuestionService.createQuizQuestion(quizQuestionData);

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Update quiz question
  static async updateQuizQuestion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const result = await QuizQuestionService.updateQuizQuestion(id, updateData);

      res.status(200).json(result);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Delete quiz question
  static async deleteQuizQuestion(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await QuizQuestionService.deleteQuizQuestion(id);

      res.status(200).json(result);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get quiz questions by category
  static async getQuizQuestionsByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await QuizQuestionService.getQuizQuestionsByCategory(category, limit);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get quiz questions by difficulty
  static async getQuizQuestionsByDifficulty(req: Request, res: Response) {
    try {
      const { difficulty } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await QuizQuestionService.getQuizQuestionsByDifficulty(difficulty, limit);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}
