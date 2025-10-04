import { Request, Response } from "express";
import { LessonService } from "../services/LessonService.js";

export class LessonController {
  // Get all lessons
  static async getAllLessons(req: Request, res: Response) {
    try {
      const filters = {
        difficulty: req.query.difficulty as string,
        category: req.query.category as string,
        subjectId: req.query.subjectId as string,
        syllabusId: req.query.syllabusId as string,
        moduleId: req.query.moduleId as string,
        isFree:
          req.query.isFree === "true"
            ? true
            : req.query.isFree === "false"
            ? false
            : undefined,
        limit: parseInt(req.query.limit as string) || 50,
      };

      const result = await LessonService.getAllLessons(filters);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get lesson by ID
  static async getLessonById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await LessonService.getLessonById(id);

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

  // Create new lesson
  static async createLesson(req: Request, res: Response) {
    try {
      const lessonData = req.body;

      const result = await LessonService.createLesson(lessonData);

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Update lesson
  static async updateLesson(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const result = await LessonService.updateLesson(id, updateData);

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

  // Delete lesson
  static async deleteLesson(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await LessonService.deleteLesson(id);

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

  // Get lessons by syllabus
  static async getLessonsBySyllabus(req: Request, res: Response) {
    try {
      const { syllabusId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await LessonService.getLessonsBySyllabus(
        syllabusId,
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

  // Get lessons by subject
  static async getLessonsBySubject(req: Request, res: Response) {
    try {
      const { subjectId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await LessonService.getLessonsBySubject(subjectId, limit);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get lessons by module
  static async getLessonsByModule(req: Request, res: Response) {
    try {
      const { moduleId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await LessonService.getLessonsByModule(moduleId, limit);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get lessons by difficulty
  static async getLessonsByDifficulty(req: Request, res: Response) {
    try {
      const { difficulty } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await LessonService.getLessonsByDifficulty(
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

  // Get free lessons
  static async getFreeLessons(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await LessonService.getFreeLessons(limit);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}
