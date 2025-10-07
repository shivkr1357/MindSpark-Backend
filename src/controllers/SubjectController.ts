import { Request, Response } from "express";
import { SubjectService } from "../services/SubjectService.js";
import { AuthenticatedRequest } from "../types/index.js";

export class SubjectController {
  private subjectService: SubjectService;

  constructor() {
    this.subjectService = new SubjectService();
  }

  /**
   * Create a new subject (Admin only)
   */
  public createSubject = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      console.log("req.user", req.user);
      const { title, description, icon, color, difficulty, estimatedTime } =
        req.body;
      console.log("req.body", req.body);
      const createdBy = req.user?.uid;

      console.log(createdBy);
      if (!createdBy) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }
      console.log(createdBy);
      const subject = await this.subjectService.createSubject(
        { title, description, icon, color, difficulty, estimatedTime },
        createdBy
      );

      res.status(201).json({
        success: true,
        data: subject,
        message: "Subject created successfully",
      });
    } catch (error) {
      console.error("Create subject error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create subject",
      });
    }
  };

  /**
   * Get all subjects
   */
  public getAllSubjects = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { subjects, total } = await this.subjectService.getAllSubjects(
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: subjects,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get all subjects error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get subjects",
      });
    }
  };

  /**
   * Get subject by ID
   */
  public getSubjectById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const subject = await this.subjectService.getSubjectById(id);

      if (!subject) {
        res.status(404).json({
          success: false,
          error: "Subject not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: subject,
      });
    } catch (error) {
      console.error("Get subject by ID error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get subject",
      });
    }
  };

  /**
   * Update subject (Admin only)
   */
  public updateSubject = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const subject = await this.subjectService.updateSubject(id, updateData);

      res.status(200).json({
        success: true,
        data: subject,
        message: "Subject updated successfully",
      });
    } catch (error) {
      console.error("Update subject error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update subject",
      });
    }
  };

  /**
   * Delete subject (Admin only)
   */
  public deleteSubject = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await this.subjectService.deleteSubject(id);

      res.status(200).json({
        success: true,
        message: "Subject deleted successfully",
      });
    } catch (error) {
      console.error("Delete subject error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete subject",
      });
    }
  };

  /**
   * Search subjects
   */
  public searchSubjects = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { q: query } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!query) {
        res.status(400).json({
          success: false,
          error: "Search query is required",
        });
        return;
      }

      const { subjects, total } = await this.subjectService.searchSubjects(
        query as string,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: subjects,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Search subjects error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to search subjects",
      });
    }
  };

  /**
   * Get subjects by difficulty
   */
  public getSubjectsByDifficulty = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { difficulty } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { subjects, total } =
        await this.subjectService.getSubjectsByDifficulty(
          difficulty,
          page,
          limit
        );

      res.status(200).json({
        success: true,
        data: subjects,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get subjects by difficulty error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get subjects by difficulty",
      });
    }
  };

  /**
   * Get subject statistics (Admin only)
   */
  public getSubjectStats = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const stats = await this.subjectService.getSubjectStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Get subject stats error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get subject statistics",
      });
    }
  };
}
