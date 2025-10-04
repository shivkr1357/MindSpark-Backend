import { FunContent } from "../models/FunContent.js";
import {
  IFunContent,
  CreateFunContentRequest,
  GetFunContentQuery,
} from "../types/index.js";

export class FunContentService {
  /**
   * Create new fun content
   */
  public async createFunContent(
    funContentData: CreateFunContentRequest,
    createdBy: string,
    subjectId?: string,
  ): Promise<IFunContent> {
    try {
      const funContent = new FunContent({
        ...funContentData,
        createdBy,
        subjectId,
      });

      await funContent.save();
      return funContent.toObject();
    } catch (error) {
      console.error("Error creating fun content:", error);
      throw new Error("Failed to create fun content");
    }
  }

  /**
   * Get fun content with filters
   */
  public async getFunContent(
    query: GetFunContentQuery = {},
  ): Promise<{ content: IFunContent[]; total: number }> {
    try {
      const {
        type,
        difficulty,
        subjectId,
        page = 1,
        limit = 10,
        random = false,
      } = query;
      const skip = (page - 1) * limit;

      // Build filter
      const filter: Record<string, unknown> = {};
      if (type) filter.type = type;
      if (difficulty) filter.difficulty = difficulty;
      if (subjectId) filter.subjectId = subjectId;

      let content: IFunContent[];
      let total: number;

      if (random) {
        // Get random content
        const pipeline = [{ $match: filter }, { $sample: { size: limit } }];
        content = await FunContent.aggregate(pipeline);
        total = await FunContent.countDocuments(filter);
      } else {
        // Get paginated content
        [content, total] = await Promise.all([
          FunContent.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
          FunContent.countDocuments(filter),
        ]);
      }

      return { content, total };
    } catch (error) {
      console.error("Error getting fun content:", error);
      throw new Error("Failed to get fun content");
    }
  }

  /**
   * Get fun content by ID
   */
  public async getFunContentById(
    contentId: string,
  ): Promise<IFunContent | null> {
    try {
      const content = await FunContent.findById(contentId).lean();
      return content;
    } catch (error) {
      console.error("Error getting fun content by ID:", error);
      throw new Error("Failed to get fun content");
    }
  }

  /**
   * Update fun content
   */
  public async updateFunContent(
    contentId: string,
    updateData: Partial<CreateFunContentRequest>,
  ): Promise<IFunContent> {
    try {
      const content = await FunContent.findByIdAndUpdate(
        contentId,
        updateData,
        { new: true, runValidators: true },
      );

      if (!content) {
        throw new Error("Fun content not found");
      }

      return content.toObject();
    } catch (error) {
      console.error("Error updating fun content:", error);
      throw new Error("Failed to update fun content");
    }
  }

  /**
   * Delete fun content
   */
  public async deleteFunContent(contentId: string): Promise<void> {
    try {
      const result = await FunContent.findByIdAndDelete(contentId);
      if (!result) {
        throw new Error("Fun content not found");
      }
    } catch (error) {
      console.error("Error deleting fun content:", error);
      throw new Error("Failed to delete fun content");
    }
  }

  /**
   * Get fun content by type
   */
  public async getFunContentByType(
    type: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ content: IFunContent[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [content, total] = await Promise.all([
        FunContent.find({ type })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        FunContent.countDocuments({ type }),
      ]);

      return { content, total };
    } catch (error) {
      console.error("Error getting fun content by type:", error);
      throw new Error("Failed to get fun content by type");
    }
  }

  /**
   * Get fun content by subject
   */
  public async getFunContentBySubject(
    subjectId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ content: IFunContent[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [content, total] = await Promise.all([
        FunContent.find({ subjectId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        FunContent.countDocuments({ subjectId }),
      ]);

      return { content, total };
    } catch (error) {
      console.error("Error getting fun content by subject:", error);
      throw new Error("Failed to get fun content by subject");
    }
  }

  /**
   * Get random fun content by type
   */
  public async getRandomFunContentByType(
    type: string,
    count: number = 5,
  ): Promise<IFunContent[]> {
    try {
      const content = await FunContent.aggregate([
        { $match: { type } },
        { $sample: { size: count } },
      ]);

      return content;
    } catch (error) {
      console.error("Error getting random fun content by type:", error);
      throw new Error("Failed to get random fun content");
    }
  }

  /**
   * Get fun content by difficulty
   */
  public async getFunContentByDifficulty(
    difficulty: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ content: IFunContent[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [content, total] = await Promise.all([
        FunContent.find({ difficulty })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        FunContent.countDocuments({ difficulty }),
      ]);

      return { content, total };
    } catch (error) {
      console.error("Error getting fun content by difficulty:", error);
      throw new Error("Failed to get fun content by difficulty");
    }
  }

  /**
   * Search fun content
   */
  public async searchFunContent(
    query: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ content: IFunContent[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const searchFilter = {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { content: { $regex: query, $options: "i" } },
        ],
      };

      const [content, total] = await Promise.all([
        FunContent.find(searchFilter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        FunContent.countDocuments(searchFilter),
      ]);

      return { content, total };
    } catch (error) {
      console.error("Error searching fun content:", error);
      throw new Error("Failed to search fun content");
    }
  }

  /**
   * Get fun content created by user
   */
  public async getFunContentByUser(
    createdBy: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ content: IFunContent[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [content, total] = await Promise.all([
        FunContent.find({ createdBy })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        FunContent.countDocuments({ createdBy }),
      ]);

      return { content, total };
    } catch (error) {
      console.error("Error getting fun content by user:", error);
      throw new Error("Failed to get fun content by user");
    }
  }

  /**
   * Get fun content statistics
   */
  public async getFunContentStats(): Promise<{
    totalContent: number;
    contentByType: Record<string, number>;
    contentByDifficulty: Record<string, number>;
  }> {
    try {
      const [totalContent, typeStats, difficultyStats] = await Promise.all([
        FunContent.countDocuments(),
        FunContent.aggregate([
          {
            $group: {
              _id: "$type",
              count: { $sum: 1 },
            },
          },
        ]),
        FunContent.aggregate([
          {
            $group: {
              _id: "$difficulty",
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

      const contentByType = typeStats.reduce(
        (acc: Record<string, number>, stat: { _id: string; count: number }) => {
          acc[stat._id] = stat.count;
          return acc;
        },
        {} as Record<string, number>,
      );

      const contentByDifficulty = difficultyStats.reduce(
        (acc: Record<string, number>, stat: { _id: string; count: number }) => {
          acc[stat._id] = stat.count;
          return acc;
        },
        {} as Record<string, number>,
      );

      return {
        totalContent,
        contentByType,
        contentByDifficulty,
      };
    } catch (error) {
      console.error("Error getting fun content stats:", error);
      throw new Error("Failed to get fun content statistics");
    }
  }

  /**
   * Get trending fun content (most recent)
   */
  public async getTrendingFunContent(
    limit: number = 10,
  ): Promise<IFunContent[]> {
    try {
      const content = await FunContent.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      return content;
    } catch (error) {
      console.error("Error getting trending fun content:", error);
      throw new Error("Failed to get trending fun content");
    }
  }
}
