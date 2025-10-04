import { Request, Response } from "express";
import { QuestionService } from "../services/QuestionService.js";
import { AuthenticatedRequest } from "../types/index.js";

export class QuestionController {
  private questionService: QuestionService;

  constructor() {
    this.questionService = new QuestionService();
  }

  /**
   * Create a new interview question (Admin only)
   */
  public createQuestion = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { subjectId } = req.params;
      const {
        question,
        options,
        correctAnswer,
        difficulty,
        explanation,
        category,
      } = req.body;
      const createdBy = req.user?.uid;

      if (!createdBy) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const interviewQuestion = await this.questionService.createQuestion(
        subjectId,
        { question, options, correctAnswer, difficulty, explanation, category },
        createdBy
      );

      res.status(201).json({
        success: true,
        data: interviewQuestion,
        message: "Question created successfully",
      });
    } catch (error) {
      console.error("Create question error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create question",
      });
    }
  };

  /**
   * Get questions by subject ID
   */
  public getQuestionsBySubject = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { subjectId } = req.params;
      const { difficulty, category, page = 1, limit = 10 } = req.query;

      const { questions, total } =
        await this.questionService.getQuestionsBySubject(subjectId, {
          difficulty: difficulty as
            | "Easy"
            | "Medium"
            | "Hard"
            | "Beginner"
            | "Intermediate"
            | "Advanced"
            | "Expert"
            | undefined,
          category: category as string,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
        });

      res.status(200).json({
        success: true,
        data: questions,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      console.error("Get questions by subject error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get questions",
      });
    }
  };

  /**
   * Get question by ID
   */
  public getQuestionById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const question = await this.questionService.getQuestionById(id);

      if (!question) {
        res.status(404).json({
          success: false,
          error: "Question not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: question,
      });
    } catch (error) {
      console.error("Get question by ID error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get question",
      });
    }
  };

  /**
   * Update question (Admin only)
   */
  public updateQuestion = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const question = await this.questionService.updateQuestion(
        id,
        updateData
      );

      res.status(200).json({
        success: true,
        data: question,
        message: "Question updated successfully",
      });
    } catch (error) {
      console.error("Update question error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update question",
      });
    }
  };

  /**
   * Delete question (Admin only)
   */
  public deleteQuestion = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await this.questionService.deleteQuestion(id);

      res.status(200).json({
        success: true,
        message: "Question deleted successfully",
      });
    } catch (error) {
      console.error("Delete question error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete question",
      });
    }
  };

  /**
   * Get random questions for practice
   */
  public getRandomQuestions = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { subjectId } = req.params;
      const { count = 10, difficulty } = req.query;

      const questions = await this.questionService.getRandomQuestions(
        subjectId,
        parseInt(count as string),
        difficulty as string
      );

      res.status(200).json({
        success: true,
        data: questions,
      });
    } catch (error) {
      console.error("Get random questions error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get random questions",
      });
    }
  };

  /**
   * Get questions by category
   */
  public getQuestionsByCategory = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { subjectId, category } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { questions, total } =
        await this.questionService.getQuestionsByCategory(
          subjectId,
          category,
          page,
          limit
        );

      res.status(200).json({
        success: true,
        data: questions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get questions by category error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get questions by category",
      });
    }
  };

  /**
   * Get questions by difficulty
   */
  public getQuestionsByDifficulty = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { subjectId, difficulty } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { questions, total } =
        await this.questionService.getQuestionsByDifficulty(
          subjectId,
          difficulty,
          page,
          limit
        );

      res.status(200).json({
        success: true,
        data: questions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get questions by difficulty error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get questions by difficulty",
      });
    }
  };

  /**
   * Search questions
   */
  public searchQuestions = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { q: query } = req.query;
      const { subjectId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!query) {
        res.status(400).json({
          success: false,
          error: "Search query is required",
        });
        return;
      }

      const { questions, total } = await this.questionService.searchQuestions(
        query as string,
        subjectId,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: questions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Search questions error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to search questions",
      });
    }
  };

  /**
   * Get question statistics (Admin only)
   */
  public getQuestionStats = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { subjectId } = req.params;
      const stats = await this.questionService.getQuestionStats(subjectId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Get question stats error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get question statistics",
      });
    }
  };

  /**
   * Get all questions (Admin only)
   */
  public getAllQuestions = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { questions, total } = await this.questionService.getAllQuestions(
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: questions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get all questions error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get all questions",
      });
    }
  };
}
