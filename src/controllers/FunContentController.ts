import { Request, Response } from "express";
import { FunContentService } from "../services/FunContentService.js";
import { AuthenticatedRequest } from "../types/index.js";

export class FunContentController {
  private funContentService: FunContentService;

  constructor() {
    this.funContentService = new FunContentService();
  }

  /**
   * Create new fun content (Admin only)
   */
  public createFunContent = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { subjectId } = req.params;
      const { type, title, content, fileUrl, difficulty } = req.body;
      const createdBy = req.user?.uid;

      if (!createdBy) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const funContent = await this.funContentService.createFunContent(
        { type, title, content, fileUrl, difficulty },
        createdBy,
        subjectId || undefined
      );

      res.status(201).json({
        success: true,
        data: funContent,
        message: "Fun content created successfully",
      });
    } catch (error) {
      console.error("Create fun content error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create fun content",
      });
    }
  };

  /**
   * Get fun content with filters
   */
  public getFunContent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { subjectId } = req.params;
      const { type, difficulty, page = 1, limit = 10, random } = req.query;

      const { content, total } = await this.funContentService.getFunContent({
        type: type as "quiz" | "puzzle" | "meme" | "motivational",
        difficulty: difficulty as
          | "Easy"
          | "Medium"
          | "Hard"
          | "Beginner"
          | "Intermediate"
          | "Advanced"
          | "Expert",
        subjectId: subjectId || undefined,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        random: random === "true",
      });

      res.status(200).json({
        success: true,
        data: content,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      console.error("Get fun content error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get fun content",
      });
    }
  };

  /**
   * Get fun content by ID
   */
  public getFunContentById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const content = await this.funContentService.getFunContentById(id);

      if (!content) {
        res.status(404).json({
          success: false,
          error: "Fun content not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: content,
      });
    } catch (error) {
      console.error("Get fun content by ID error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get fun content",
      });
    }
  };

  /**
   * Update fun content (Admin only)
   */
  public updateFunContent = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      console.log("updateData", updateData);
      console.log("id", id);

      const content = await this.funContentService.updateFunContent(
        id,
        updateData
      );

      res.status(200).json({
        success: true,
        data: content,
        message: "Fun content updated successfully",
      });
    } catch (error) {
      console.error("Update fun content error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update fun content",
      });
    }
  };

  /**
   * Delete fun content (Admin only)
   */
  public deleteFunContent = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await this.funContentService.deleteFunContent(id);

      res.status(200).json({
        success: true,
        message: "Fun content deleted successfully",
      });
    } catch (error) {
      console.error("Delete fun content error:", error);
      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete fun content",
      });
    }
  };

  /**
   * Get fun content by type
   */
  public getFunContentByType = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { type } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { content, total } =
        await this.funContentService.getFunContentByType(type, page, limit);

      res.status(200).json({
        success: true,
        data: content,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get fun content by type error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get fun content by type",
      });
    }
  };

  /**
   * Get fun content by subject
   */
  public getFunContentBySubject = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { subjectId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { content, total } =
        await this.funContentService.getFunContentBySubject(
          subjectId,
          page,
          limit
        );

      res.status(200).json({
        success: true,
        data: content,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get fun content by subject error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get fun content by subject",
      });
    }
  };

  /**
   * Get random fun content by type
   */
  public getRandomFunContentByType = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { type } = req.params;
      const { count = 5 } = req.query;

      const content = await this.funContentService.getRandomFunContentByType(
        type,
        parseInt(count as string)
      );

      res.status(200).json({
        success: true,
        data: content,
      });
    } catch (error) {
      console.error("Get random fun content by type error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get random fun content",
      });
    }
  };

  /**
   * Get fun content by difficulty
   */
  public getFunContentByDifficulty = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { difficulty } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { content, total } =
        await this.funContentService.getFunContentByDifficulty(
          difficulty,
          page,
          limit
        );

      res.status(200).json({
        success: true,
        data: content,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get fun content by difficulty error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get fun content by difficulty",
      });
    }
  };

  /**
   * Search fun content
   */
  public searchFunContent = async (
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

      const { content, total } = await this.funContentService.searchFunContent(
        query as string,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: content,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Search fun content error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to search fun content",
      });
    }
  };

  /**
   * Get trending fun content
   */
  public getTrendingFunContent = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { limit = 10 } = req.query;

      const content = await this.funContentService.getTrendingFunContent(
        parseInt(limit as string)
      );

      res.status(200).json({
        success: true,
        data: content,
      });
    } catch (error) {
      console.error("Get trending fun content error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get trending fun content",
      });
    }
  };

  /**
   * Get fun content statistics (Admin only)
   */
  public getFunContentStats = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const stats = await this.funContentService.getFunContentStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Get fun content stats error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get fun content statistics",
      });
    }
  };
}
