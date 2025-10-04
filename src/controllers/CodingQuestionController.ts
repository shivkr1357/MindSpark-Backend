import { Request, Response } from "express";
import { CodingQuestionService } from "../services/CodingQuestionService.js";

export class CodingQuestionController {
  // Get all coding questions
  static async getAllCodingQuestions(req: Request, res: Response) {
    try {
      const filters = {
        difficulty: req.query.difficulty as string,
        category: req.query.category as string,
        language: req.query.language as string,
        subjectId: req.query.subjectId as string,
        interviewQuestionId: req.query.interviewQuestionId as string,
        limit: parseInt(req.query.limit as string) || 50,
      };

      const result = await CodingQuestionService.getAllCodingQuestions(filters);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get coding question by ID
  static async getCodingQuestionById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await CodingQuestionService.getCodingQuestionById(id);

      res.status(200).json(result);
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message.includes("not found")
          ? 404
          : 500;
      res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Create new coding question
  static async createCodingQuestion(req: Request, res: Response) {
    try {
      const codingQuestionData = req.body;

      const result = await CodingQuestionService.createCodingQuestion(
        codingQuestionData
      );

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Update coding question
  static async updateCodingQuestion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const result = await CodingQuestionService.updateCodingQuestion(
        id,
        updateData
      );

      res.status(200).json(result);
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message.includes("not found")
          ? 404
          : 500;
      res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Delete coding question
  static async deleteCodingQuestion(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await CodingQuestionService.deleteCodingQuestion(id);

      res.status(200).json(result);
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message.includes("not found")
          ? 404
          : 500;
      res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get coding questions by difficulty
  static async getCodingQuestionsByDifficulty(req: Request, res: Response) {
    try {
      const { difficulty } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await CodingQuestionService.getCodingQuestionsByDifficulty(
        difficulty,
        limit
      );

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get coding questions by language
  static async getCodingQuestionsByLanguage(req: Request, res: Response) {
    try {
      const { language } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await CodingQuestionService.getCodingQuestionsByLanguage(
        language,
        limit
      );

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get coding questions by category
  static async getCodingQuestionsByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await CodingQuestionService.getCodingQuestionsByCategory(
        category,
        limit
      );

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get public test cases
  static async getPublicTestCases(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await CodingQuestionService.getPublicTestCases(id);

      res.status(200).json(result);
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message.includes("not found")
          ? 404
          : 500;
      res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}
