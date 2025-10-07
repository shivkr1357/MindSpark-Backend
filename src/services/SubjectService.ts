import { Subject } from "../models/Subject.js";
import { ISubject, CreateSubjectRequest } from "../types/index.js";

export class SubjectService {
  /**
   * Create a new subject
   */
  public async createSubject(
    subjectData: CreateSubjectRequest,
    createdBy: string
  ): Promise<ISubject> {
    try {
      const subject = new Subject({
        ...subjectData,
        createdBy,
      });

      await subject.save();
      return subject.toObject();
    } catch (error) {
      console.error("Error creating subject:", error);
      throw new Error("Failed to create subject");
    }
  }

  /**
   * Get all subjects
   */
  public async getAllSubjects(
    page: number = 1,
    limit: number = 10
  ): Promise<{ subjects: ISubject[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [subjects, total] = await Promise.all([
        Subject.find()
          .populate("categoryId", "name slug icon color")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Subject.countDocuments(),
      ]);

      return { subjects, total };
    } catch (error) {
      console.error("Error getting all subjects:", error);
      throw new Error("Failed to get subjects");
    }
  }

  /**
   * Get subject by ID
   */
  public async getSubjectById(subjectId: string): Promise<ISubject | null> {
    try {
      const subject = await Subject.findById(subjectId)
        .populate("categoryId", "name slug icon color")
        .lean();
      return subject;
    } catch (error) {
      console.error("Error getting subject by ID:", error);
      throw new Error("Failed to get subject");
    }
  }

  /**
   * Update subject
   */
  public async updateSubject(
    subjectId: string,
    updateData: Partial<CreateSubjectRequest>
  ): Promise<ISubject> {
    try {
      const subject = await Subject.findByIdAndUpdate(subjectId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!subject) {
        throw new Error("Subject not found");
      }

      return subject.toObject();
    } catch (error) {
      console.error("Error updating subject:", error);
      throw new Error("Failed to update subject");
    }
  }

  /**
   * Delete subject
   */
  public async deleteSubject(subjectId: string): Promise<void> {
    try {
      const result = await Subject.findByIdAndDelete(subjectId);
      if (!result) {
        throw new Error("Subject not found");
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
      throw new Error("Failed to delete subject");
    }
  }

  /**
   * Search subjects
   */
  public async searchSubjects(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ subjects: ISubject[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const searchQuery = {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      };

      const [subjects, total] = await Promise.all([
        Subject.find(searchQuery)
          .populate("categoryId", "name slug icon color")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Subject.countDocuments(searchQuery),
      ]);

      return { subjects, total };
    } catch (error) {
      console.error("Error searching subjects:", error);
      throw new Error("Failed to search subjects");
    }
  }

  /**
   * Get subjects by difficulty
   */
  public async getSubjectsByDifficulty(
    difficulty: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ subjects: ISubject[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [subjects, total] = await Promise.all([
        Subject.find({ difficulty })
          .populate("categoryId", "name slug icon color")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Subject.countDocuments({ difficulty }),
      ]);

      return { subjects, total };
    } catch (error) {
      console.error("Error getting subjects by difficulty:", error);
      throw new Error("Failed to get subjects by difficulty");
    }
  }

  /**
   * Get subjects created by user
   */
  public async getSubjectsByUser(
    createdBy: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ subjects: ISubject[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [subjects, total] = await Promise.all([
        Subject.find({ createdBy })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Subject.countDocuments({ createdBy }),
      ]);

      return { subjects, total };
    } catch (error) {
      console.error("Error getting subjects by user:", error);
      throw new Error("Failed to get subjects by user");
    }
  }

  /**
   * Get subject statistics
   */
  public async getSubjectStats(): Promise<{
    totalSubjects: number;
    subjectsByDifficulty: Record<string, number>;
  }> {
    try {
      const [totalSubjects, difficultyStats] = await Promise.all([
        Subject.countDocuments(),
        Subject.aggregate([
          {
            $group: {
              _id: "$difficulty",
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

      const subjectsByDifficulty = difficultyStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalSubjects,
        subjectsByDifficulty,
      };
    } catch (error) {
      console.error("Error getting subject stats:", error);
      throw new Error("Failed to get subject statistics");
    }
  }
}
