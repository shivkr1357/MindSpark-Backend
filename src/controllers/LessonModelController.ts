import { Request, Response } from "express";
import { LessonModelService } from "../services/LessonModelService.js";
import { AuthenticatedRequest } from "../types/index.js";

export class LessonModelController {
  private lessonService: LessonModelService;

  constructor() {
    this.lessonService = new LessonModelService();
  }

  /**
   * Get all lessons for a module
   */
  public getLessonsByModule = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { moduleId } = req.params;
      const lessons = await this.lessonService.getLessonsByModule(moduleId);

      res.status(200).json({
        success: true,
        data: lessons,
      });
    } catch (error) {
      console.error("Get lessons error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch lessons",
      });
    }
  };

  /**
   * Get all lessons for a syllabus
   */
  public getLessonsBySyllabus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { syllabusId } = req.params;
      const lessons = await this.lessonService.getLessonsBySyllabus(syllabusId);

      res.status(200).json({
        success: true,
        data: lessons,
      });
    } catch (error) {
      console.error("Get lessons error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch lessons",
      });
    }
  };

  /**
   * Get lesson by ID
   */
  public getLessonById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const lesson = await this.lessonService.getLessonById(id);

      if (!lesson) {
        res.status(404).json({
          success: false,
          error: "Lesson not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: lesson,
      });
    } catch (error) {
      console.error("Get lesson error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch lesson",
      });
    }
  };

  /**
   * Create a new lesson
   */
  public createLesson = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { moduleId } = req.params;
      const lessonData = {
        ...req.body,
        moduleId,
        createdBy: req.user?.uid || "system",
      };

      const lesson = await this.lessonService.createLesson(lessonData);

      res.status(201).json({
        success: true,
        data: lesson,
        message: "Lesson created successfully",
      });
    } catch (error) {
      console.error("Create lesson error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create lesson",
      });
    }
  };

  /**
   * Update a lesson
   */
  public updateLesson = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const lesson = await this.lessonService.updateLesson(id, req.body);

      res.status(200).json({
        success: true,
        data: lesson,
        message: "Lesson updated successfully",
      });
    } catch (error) {
      console.error("Update lesson error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update lesson",
      });
    }
  };

  /**
   * Delete a lesson
   */
  public deleteLesson = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await this.lessonService.deleteLesson(id);

      res.status(200).json({
        success: true,
        message: "Lesson deleted successfully",
      });
    } catch (error) {
      console.error("Delete lesson error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete lesson",
      });
    }
  };

  /**
   * Reorder lessons
   */
  public reorderLessons = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { moduleId } = req.params;
      const { lessonOrders } = req.body;

      await this.lessonService.reorderLessons(moduleId, lessonOrders);

      res.status(200).json({
        success: true,
        message: "Lessons reordered successfully",
      });
    } catch (error) {
      console.error("Reorder lessons error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to reorder lessons",
      });
    }
  };
}
