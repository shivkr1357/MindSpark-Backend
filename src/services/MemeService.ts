import { Meme, IMeme } from "../models/index.js";
import { Types } from "mongoose";

export class MemeService {
  // Get all memes with optional filtering
  static async getAllMemes(filters: any = {}) {
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
      if (filters.isNSFW !== undefined) {
        query.isNSFW = filters.isNSFW;
      }

      const memes = await Meme.find(query)
        .sort({ createdAt: -1 })
        .limit(filters.limit || 50);

      return {
        success: true,
        data: memes,
        count: memes.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch memes: ${error}`);
    }
  }

  // Get a single meme by ID
  static async getMemeById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid meme ID");
      }

      const meme = await Meme.findOne({
        _id: id,
        isActive: true,
      });

      if (!meme) {
        throw new Error("Meme not found");
      }

      return {
        success: true,
        data: meme,
      };
    } catch (error) {
      throw new Error(`Failed to fetch meme: ${error}`);
    }
  }

  // Create a new meme
  static async createMeme(memeData: Partial<IMeme>) {
    try {
      const meme = new Meme(memeData);
      await meme.save();

      return {
        success: true,
        data: meme,
      };
    } catch (error) {
      throw new Error(`Failed to create meme: ${error}`);
    }
  }

  // Update a meme
  static async updateMeme(id: string, updateData: Partial<IMeme>) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid meme ID");
      }

      const meme = await Meme.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!meme) {
        throw new Error("Meme not found");
      }

      return {
        success: true,
        data: meme,
      };
    } catch (error) {
      throw new Error(`Failed to update meme: ${error}`);
    }
  }

  // Delete a meme (soft delete)
  static async deleteMeme(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid meme ID");
      }

      const meme = await Meme.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );

      if (!meme) {
        throw new Error("Meme not found");
      }

      return {
        success: true,
        message: "Meme deleted successfully",
      };
    } catch (error) {
      throw new Error(`Failed to delete meme: ${error}`);
    }
  }

  // Get trending memes (by engagement score)
  static async getTrendingMemes(limit: number = 10) {
    try {
      const memes = await Meme.find({ isActive: true })
        .sort({ likes: -1, shares: -1, views: -1 })
        .limit(limit);

      return {
        success: true,
        data: memes,
        count: memes.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch trending memes: ${error}`);
    }
  }

  // Get memes by category
  static async getMemesByCategory(category: string, limit: number = 10) {
    try {
      const memes = await Meme.find({
        category,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .limit(limit);

      return {
        success: true,
        data: memes,
        count: memes.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch memes by category: ${error}`);
    }
  }

  // Increment meme engagement (likes, shares, views)
  static async incrementEngagement(id: string, type: 'likes' | 'shares' | 'views') {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid meme ID");
      }

      const updateQuery = { $inc: { [type]: 1 } };
      const meme = await Meme.findByIdAndUpdate(id, updateQuery, { new: true });

      if (!meme) {
        throw new Error("Meme not found");
      }

      return {
        success: true,
        data: meme,
      };
    } catch (error) {
      throw new Error(`Failed to increment engagement: ${error}`);
    }
  }
}
