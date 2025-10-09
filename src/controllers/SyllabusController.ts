import { Request, Response } from "express";
import { SyllabusService } from "../services/SyllabusService.js";
import { AuthenticatedRequest } from "../types/index.js";

export class SyllabusController {
  private syllabusService: SyllabusService;

  constructor() {
    this.syllabusService = new SyllabusService();
  }

  /**
   * Create syllabus for a subject (Admin only)
   */
  public createSyllabus = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { subjectId } = req.params;
      const { title, description, totalDuration, difficulty } = req.body;
      const createdBy = req.user?.uid;

      if (!createdBy) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const syllabus = await this.syllabusService.createSyllabus(
        subjectId,
        { title, description, totalDuration, difficulty },
        createdBy
      );

      res.status(201).json({
        success: true,
        data: syllabus,
        message: "Syllabus created successfully",
      });
    } catch (error) {
      console.error("Create syllabus error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create syllabus",
      });
    }
  };

  /**
   * Get syllabus by subject ID
   */
  public getSyllabusBySubject = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { subjectId } = req.params;
      const syllabus = await this.syllabusService.getSyllabusBySubject(
        subjectId
      );

      if (!syllabus) {
        res.status(404).json({
          success: false,
          error: "Syllabus not found for this subject",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: syllabus,
      });
    } catch (error) {
      console.error("Get syllabus by subject error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get syllabus",
      });
    }
  };

  /**
   * Get syllabus by ID
   */
  public getSyllabusById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const syllabus = await this.syllabusService.getSyllabusById(id);

      if (!syllabus) {
        res.status(404).json({
          success: false,
          error: "Syllabus not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: syllabus,
      });
    } catch (error) {
      console.error("Get syllabus by ID error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get syllabus",
      });
    }
  };

  /**
   * Update syllabus (Admin only)
   */
  public updateSyllabus = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const syllabus = await this.syllabusService.updateSyllabus(
        id,
        updateData
      );

      res.status(200).json({
        success: true,
        data: syllabus,
        message: "Syllabus updated successfully",
      });
    } catch (error) {
      console.error("Update syllabus error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update syllabus",
      });
    }
  };

  /**
   * Delete syllabus (Admin only)
   */
  public deleteSyllabus = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await this.syllabusService.deleteSyllabus(id);

      res.status(200).json({
        success: true,
        message: "Syllabus deleted successfully",
      });
    } catch (error) {
      console.error("Delete syllabus error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete syllabus",
      });
    }
  };

  /**
   * Get all syllabi (Admin only)
   */
  public getAllSyllabi = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { syllabi, total } = await this.syllabusService.getAllSyllabi(
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: syllabi,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get all syllabi error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get syllabi",
      });
    }
  };

  /**
   * Get syllabi by difficulty
   */
  public getSyllabiByDifficulty = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { difficulty } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { syllabi, total } =
        await this.syllabusService.getSyllabiByDifficulty(
          difficulty,
          page,
          limit
        );

      res.status(200).json({
        success: true,
        data: syllabi,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get syllabi by difficulty error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get syllabi by difficulty",
      });
    }
  };
}
