import { Request, Response } from "express";
import { MotivationService } from "../services/MotivationService.js";

export class MotivationController {
  // Get all motivational content
  static async getAllMotivations(req: Request, res: Response) {
    try {
      const filters = {
        type: req.query.type as string,
        category: req.query.category as string,
        subjectId: req.query.subjectId as string,
        funContentId: req.query.funContentId as string,
        isFeatured:
          req.query.isFeatured === "true"
            ? true
            : req.query.isFeatured === "false"
            ? false
            : undefined,
        limit: parseInt(req.query.limit as string) || 50,
      };

      const result = await MotivationService.getAllMotivations(filters);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get motivational content by ID
  static async getMotivationById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await MotivationService.getMotivationById(id);

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

  // Create new motivational content
  static async createMotivation(req: Request, res: Response) {
    try {
      const motivationData = req.body;

      const result = await MotivationService.createMotivation(motivationData);

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Update motivational content
  static async updateMotivation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const result = await MotivationService.updateMotivation(id, updateData);

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

  // Delete motivational content
  static async deleteMotivation(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await MotivationService.deleteMotivation(id);

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

  // Get featured motivational content
  static async getFeaturedMotivations(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await MotivationService.getFeaturedMotivations(limit);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get motivational content by category
  static async getMotivationsByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await MotivationService.getMotivationsByCategory(
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

  // Get motivational content by type
  static async getMotivationsByType(req: Request, res: Response) {
    try {
      const { type } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await MotivationService.getMotivationsByType(type, limit);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Increment engagement
  static async incrementEngagement(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { type } = req.body;

      if (!["likes", "shares", "views", "bookmarks"].includes(type)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid engagement type. Must be 'likes', 'shares', 'views', or 'bookmarks'",
        });
      }

      const result = await MotivationService.incrementEngagement(id, type);

      return res.status(200).json(result);
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message.includes("not found")
          ? 404
          : 500;
      return res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}
