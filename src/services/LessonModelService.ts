import { LessonModel, type ILessonModel } from "../models/LessonModel.js";

export interface CreateLessonRequest {
  moduleId: string;
  syllabusId: string;
  title: string;
  content: string;
  type?: "text" | "code" | "image" | "video" | "quiz";
  fileUrl?: string;
  duration?: string;
  difficulty?: string;
  order: number;
  resources?: Array<{
    type: "link" | "document" | "video" | "image" | "code";
    title: string;
    url: string;
  }>;
  objectives?: string[];
  createdBy: string;
}

export interface UpdateLessonRequest {
  title?: string;
  content?: string;
  type?: "text" | "code" | "image" | "video" | "quiz";
  fileUrl?: string;
  duration?: string;
  difficulty?: string;
  order?: number;
  resources?: Array<{
    type: "link" | "document" | "video" | "image" | "code";
    title: string;
    url: string;
  }>;
  objectives?: string[];
  isActive?: boolean;
}

export class LessonModelService {
  /**
   * Get all lessons for a module
   */
  public async getLessonsByModule(moduleId: string): Promise<ILessonModel[]> {
    try {
      const lessons = await LessonModel.find({ moduleId }).sort({ order: 1 });
      return lessons;
    } catch (error) {
      console.error("Error fetching lessons:", error);
      throw new Error("Failed to fetch lessons");
    }
  }

  /**
   * Get all lessons for a syllabus
   */
  public async getLessonsBySyllabus(
    syllabusId: string
  ): Promise<ILessonModel[]> {
    try {
      const lessons = await LessonModel.find({ syllabusId }).sort({
        order: 1,
      });
      return lessons;
    } catch (error) {
      console.error("Error fetching lessons:", error);
      throw new Error("Failed to fetch lessons");
    }
  }

  /**
   * Get lesson by ID
   */
  public async getLessonById(lessonId: string): Promise<ILessonModel | null> {
    try {
      const lesson = await LessonModel.findById(lessonId);
      return lesson;
    } catch (error) {
      console.error("Error fetching lesson:", error);
      throw new Error("Failed to fetch lesson");
    }
  }

  /**
   * Create a new lesson
   */
  public async createLesson(data: CreateLessonRequest): Promise<ILessonModel> {
    try {
      const lesson = await LessonModel.create(data);
      return lesson.toObject();
    } catch (error) {
      console.error("Error creating lesson:", error);
      throw new Error("Failed to create lesson");
    }
  }

  /**
   * Update a lesson
   */
  public async updateLesson(
    lessonId: string,
    data: UpdateLessonRequest
  ): Promise<ILessonModel> {
    try {
      const lesson = await LessonModel.findByIdAndUpdate(lessonId, data, {
        new: true,
        runValidators: true,
      });

      if (!lesson) {
        throw new Error("Lesson not found");
      }

      return lesson.toObject();
    } catch (error) {
      console.error("Error updating lesson:", error);
      throw new Error("Failed to update lesson");
    }
  }

  /**
   * Delete a lesson
   */
  public async deleteLesson(lessonId: string): Promise<void> {
    try {
      const result = await LessonModel.findByIdAndDelete(lessonId);
      if (!result) {
        throw new Error("Lesson not found");
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
      throw new Error("Failed to delete lesson");
    }
  }

  /**
   * Reorder lessons
   */
  public async reorderLessons(
    moduleId: string,
    lessonOrders: Array<{ lessonId: string; order: number }>
  ): Promise<void> {
    try {
      const bulkOps = lessonOrders.map(({ lessonId, order }) => ({
        updateOne: {
          filter: { _id: lessonId, moduleId },
          update: { order },
        },
      }));

      await LessonModel.bulkWrite(bulkOps);
    } catch (error) {
      console.error("Error reordering lessons:", error);
      throw new Error("Failed to reorder lessons");
    }
  }
}
