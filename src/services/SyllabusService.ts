import { Syllabus } from "../models/Syllabus.js";
import { ISyllabus, CreateSyllabusRequest } from "../types/index.js";

export class SyllabusService {
  /**
   * Create a new syllabus
   */
  public async createSyllabus(
    subjectId: string,
    syllabusData: CreateSyllabusRequest,
    createdBy: string
  ): Promise<ISyllabus> {
    try {
      const syllabus = new Syllabus({
        ...syllabusData,
        subjectId,
        createdBy,
      });

      await syllabus.save();
      return syllabus.toObject();
    } catch (error) {
      console.error("Error creating syllabus:", error);
      throw new Error("Failed to create syllabus");
    }
  }

  /**
   * Get syllabus by subject ID
   */
  public async getSyllabusBySubject(
    subjectId: string
  ): Promise<ISyllabus | null> {
    try {
      const syllabus = await Syllabus.findOne({ subjectId }).lean();
      console.log("syllabus", syllabus);
      return syllabus;
    } catch (error) {
      console.error("Error getting syllabus by subject:", error);
      throw new Error("Failed to get syllabus");
    }
  }

  /**
   * Get syllabus by ID
   */
  public async getSyllabusById(syllabusId: string): Promise<ISyllabus | null> {
    try {
      const syllabus = await Syllabus.findById(syllabusId).lean();
      return syllabus;
    } catch (error) {
      console.error("Error getting syllabus by ID:", error);
      throw new Error("Failed to get syllabus");
    }
  }

  /**
   * Update syllabus
   */
  public async updateSyllabus(
    syllabusId: string,
    updateData: Partial<CreateSyllabusRequest>
  ): Promise<ISyllabus> {
    try {
      const syllabus = await Syllabus.findByIdAndUpdate(
        syllabusId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!syllabus) {
        throw new Error("Syllabus not found");
      }

      return syllabus.toObject();
    } catch (error) {
      console.error("Error updating syllabus:", error);
      throw new Error("Failed to update syllabus");
    }
  }

  /**
   * Delete syllabus
   */
  public async deleteSyllabus(syllabusId: string): Promise<void> {
    try {
      const result = await Syllabus.findByIdAndDelete(syllabusId);
      if (!result) {
        throw new Error("Syllabus not found");
      }
    } catch (error) {
      console.error("Error deleting syllabus:", error);
      throw new Error("Failed to delete syllabus");
    }
  }

  /**
   * Get all syllabi
   */
  public async getAllSyllabi(
    page: number = 1,
    limit: number = 10
  ): Promise<{ syllabi: ISyllabus[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [syllabi, total] = await Promise.all([
        Syllabus.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Syllabus.countDocuments(),
      ]);

      return { syllabi, total };
    } catch (error) {
      console.error("Error getting all syllabi:", error);
      throw new Error("Failed to get syllabi");
    }
  }

  /**
   * Get syllabi by difficulty
   */
  public async getSyllabiByDifficulty(
    difficulty: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ syllabi: ISyllabus[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [syllabi, total] = await Promise.all([
        Syllabus.find({ difficulty })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Syllabus.countDocuments({ difficulty }),
      ]);

      return { syllabi, total };
    } catch (error) {
      console.error("Error getting syllabi by difficulty:", error);
      throw new Error("Failed to get syllabi by difficulty");
    }
  }

  /**
   * Get syllabi created by user
   */
  public async getSyllabiByUser(
    createdBy: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ syllabi: ISyllabus[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [syllabi, total] = await Promise.all([
        Syllabus.find({ createdBy })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Syllabus.countDocuments({ createdBy }),
      ]);

      return { syllabi, total };
    } catch (error) {
      console.error("Error getting syllabi by user:", error);
      throw new Error("Failed to get syllabi by user");
    }
  }
}
