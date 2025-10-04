import { Motivation, IMotivation } from "../models/index.js";
import { Types } from "mongoose";

export class MotivationService {
  // Get all motivational content with optional filtering
  static async getAllMotivations(filters: any = {}) {
    try {
      const query: any = { isActive: true };

      // Apply filters
      if (filters.type) {
        query.type = filters.type;
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
      if (filters.isFeatured !== undefined) {
        query.isFeatured = filters.isFeatured;
      }

      const motivations = await Motivation.find(query)
        .sort({ createdAt: -1 })
        .limit(filters.limit || 50);

      return {
        success: true,
        data: motivations,
        count: motivations.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch motivational content: ${error}`);
    }
  }

  // Get a single motivational content by ID
  static async getMotivationById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid motivation ID");
      }

      const motivation = await Motivation.findOne({
        _id: id,
        isActive: true,
      });

      if (!motivation) {
        throw new Error("Motivational content not found");
      }

      return {
        success: true,
        data: motivation,
      };
    } catch (error) {
      throw new Error(`Failed to fetch motivational content: ${error}`);
    }
  }

  // Create a new motivational content
  static async createMotivation(motivationData: Partial<IMotivation>) {
    try {
      const motivation = new Motivation(motivationData);
      await motivation.save();

      return {
        success: true,
        data: motivation,
      };
    } catch (error) {
      throw new Error(`Failed to create motivational content: ${error}`);
    }
  }

  // Update motivational content
  static async updateMotivation(id: string, updateData: Partial<IMotivation>) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid motivation ID");
      }

      const motivation = await Motivation.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!motivation) {
        throw new Error("Motivational content not found");
      }

      return {
        success: true,
        data: motivation,
      };
    } catch (error) {
      throw new Error(`Failed to update motivational content: ${error}`);
    }
  }

  // Delete motivational content (soft delete)
  static async deleteMotivation(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid motivation ID");
      }

      const motivation = await Motivation.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );

      if (!motivation) {
        throw new Error("Motivational content not found");
      }

      return {
        success: true,
        message: "Motivational content deleted successfully",
      };
    } catch (error) {
      throw new Error(`Failed to delete motivational content: ${error}`);
    }
  }

  // Get featured motivational content
  static async getFeaturedMotivations(limit: number = 10) {
    try {
      const motivations = await Motivation.find({
        isActive: true,
        isFeatured: true,
      })
        .sort({ createdAt: -1 })
        .limit(limit);

      return {
        success: true,
        data: motivations,
        count: motivations.length,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch featured motivational content: ${error}`
      );
    }
  }

  // Get motivational content by category
  static async getMotivationsByCategory(category: string, limit: number = 10) {
    try {
      const motivations = await Motivation.find({
        category,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .limit(limit);

      return {
        success: true,
        data: motivations,
        count: motivations.length,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch motivational content by category: ${error}`
      );
    }
  }

  // Get motivational content by type
  static async getMotivationsByType(type: string, limit: number = 10) {
    try {
      const motivations = await Motivation.find({
        type,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .limit(limit);

      return {
        success: true,
        data: motivations,
        count: motivations.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch motivational content by type: ${error}`);
    }
  }

  // Increment engagement (likes, shares, views, bookmarks)
  static async incrementEngagement(
    id: string,
    type: "likes" | "shares" | "views" | "bookmarks"
  ) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid motivation ID");
      }

      const updateQuery = { $inc: { [type]: 1 } };
      const motivation = await Motivation.findByIdAndUpdate(id, updateQuery, {
        new: true,
      });

      if (!motivation) {
        throw new Error("Motivational content not found");
      }

      return {
        success: true,
        data: motivation,
      };
    } catch (error) {
      throw new Error(`Failed to increment engagement: ${error}`);
    }
  }
}
