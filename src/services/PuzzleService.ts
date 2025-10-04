import { Puzzle, IPuzzle } from "../models/index.js";
import { Types } from "mongoose";

export class PuzzleService {
  // Get all puzzles with optional filtering
  static async getAllPuzzles(filters: any = {}) {
    try {
      const query: any = { isActive: true };

      // Apply filters
      if (filters.type) {
        query.type = filters.type;
      }
      if (filters.difficulty) {
        query.difficulty = filters.difficulty;
      }
      if (filters.category) {
        query.category = filters.category;
      }
      if (filters.subjectId) {
        query.subjectId = filters.subjectId;
      }
      if (filters.funContentId) {
        query.funContentId = filters.funContentId;
      }

      const puzzles = await Puzzle.find(query)
        .sort({ createdAt: -1 })
        .limit(filters.limit || 50);

      return {
        success: true,
        data: puzzles,
        count: puzzles.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch puzzles: ${error}`);
    }
  }

  // Get a single puzzle by ID
  static async getPuzzleById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid puzzle ID");
      }

      const puzzle = await Puzzle.findOne({
        _id: id,
        isActive: true,
      });

      if (!puzzle) {
        throw new Error("Puzzle not found");
      }

      return {
        success: true,
        data: puzzle,
      };
    } catch (error) {
      throw new Error(`Failed to fetch puzzle: ${error}`);
    }
  }

  // Create a new puzzle
  static async createPuzzle(puzzleData: Partial<IPuzzle>) {
    try {
      const puzzle = new Puzzle(puzzleData);
      await puzzle.save();

      return {
        success: true,
        data: puzzle,
      };
    } catch (error) {
      throw new Error(`Failed to create puzzle: ${error}`);
    }
  }

  // Update a puzzle
  static async updatePuzzle(id: string, updateData: Partial<IPuzzle>) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid puzzle ID");
      }

      const puzzle = await Puzzle.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!puzzle) {
        throw new Error("Puzzle not found");
      }

      return {
        success: true,
        data: puzzle,
      };
    } catch (error) {
      throw new Error(`Failed to update puzzle: ${error}`);
    }
  }

  // Delete a puzzle (soft delete)
  static async deletePuzzle(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid puzzle ID");
      }

      const puzzle = await Puzzle.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );

      if (!puzzle) {
        throw new Error("Puzzle not found");
      }

      return {
        success: true,
        message: "Puzzle deleted successfully",
      };
    } catch (error) {
      throw new Error(`Failed to delete puzzle: ${error}`);
    }
  }

  // Get puzzles by type
  static async getPuzzlesByType(type: string, limit: number = 10) {
    try {
      const puzzles = await Puzzle.find({
        type,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .limit(limit);

      return {
        success: true,
        data: puzzles,
        count: puzzles.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch puzzles by type: ${error}`);
    }
  }

  // Get puzzles by difficulty
  static async getPuzzlesByDifficulty(difficulty: string, limit: number = 10) {
    try {
      const puzzles = await Puzzle.find({
        difficulty,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .limit(limit);

      return {
        success: true,
        data: puzzles,
        count: puzzles.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch puzzles by difficulty: ${error}`);
    }
  }
}
