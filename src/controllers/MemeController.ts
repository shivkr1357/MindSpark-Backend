import { Request, Response } from "express";
import { MemeService } from "../services/MemeService.js";

export class MemeController {
  // Get all memes
  static async getAllMemes(req: Request, res: Response) {
    try {
      const filters = {
        type: req.query.type as string,
        category: req.query.category as string,
        subjectId: req.query.subjectId as string,
        funContentId: req.query.funContentId as string,
        isNSFW:
          req.query.isNSFW === "true"
            ? true
            : req.query.isNSFW === "false"
            ? false
            : undefined,
        limit: parseInt(req.query.limit as string) || 50,
      };

      const result = await MemeService.getAllMemes(filters);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get meme by ID
  static async getMemeById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await MemeService.getMemeById(id);

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

  // Create new meme
  static async createMeme(req: Request, res: Response) {
    try {
      const memeData = req.body;

      const result = await MemeService.createMeme(memeData);

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Update meme
  static async updateMeme(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const result = await MemeService.updateMeme(id, updateData);

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

  // Delete meme
  static async deleteMeme(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await MemeService.deleteMeme(id);

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

  // Get trending memes
  static async getTrendingMemes(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await MemeService.getTrendingMemes(limit);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get memes by category
  static async getMemesByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await MemeService.getMemesByCategory(category, limit);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Increment meme engagement
  static async incrementEngagement(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { type } = req.body;

      if (!["likes", "shares", "views"].includes(type)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid engagement type. Must be 'likes', 'shares', or 'views'",
        });
      }

      const result = await MemeService.incrementEngagement(id, type);

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
