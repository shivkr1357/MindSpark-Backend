import { Request, Response } from "express";
import { PuzzleService } from "../services/PuzzleService.js";

export class PuzzleController {
  // Get all puzzles
  static async getAllPuzzles(req: Request, res: Response) {
    try {
      const filters = {
        type: req.query.type as string,
        difficulty: req.query.difficulty as string,
        category: req.query.category as string,
        subjectId: req.query.subjectId as string,
        funContentId: req.query.funContentId as string,
        limit: parseInt(req.query.limit as string) || 50,
      };

      const result = await PuzzleService.getAllPuzzles(filters);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get puzzle by ID
  static async getPuzzleById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await PuzzleService.getPuzzleById(id);

      res.status(200).json(result);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Create new puzzle
  static async createPuzzle(req: Request, res: Response) {
    try {
      const puzzleData = req.body;

      const result = await PuzzleService.createPuzzle(puzzleData);

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Update puzzle
  static async updatePuzzle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const result = await PuzzleService.updatePuzzle(id, updateData);

      res.status(200).json(result);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Delete puzzle
  static async deletePuzzle(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await PuzzleService.deletePuzzle(id);

      res.status(200).json(result);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get puzzles by type
  static async getPuzzlesByType(req: Request, res: Response) {
    try {
      const { type } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await PuzzleService.getPuzzlesByType(type, limit);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // Get puzzles by difficulty
  static async getPuzzlesByDifficulty(req: Request, res: Response) {
    try {
      const { difficulty } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await PuzzleService.getPuzzlesByDifficulty(difficulty, limit);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}
