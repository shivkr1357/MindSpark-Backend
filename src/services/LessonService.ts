import { Lesson, ILesson } from "../models/index.js";
import { Types } from "mongoose";

export class LessonService {
  // Get all lessons with optional filtering
  static async getAllLessons(filters: any = {}) {
    try {
      const query: any = { isActive: true };

      // Apply filters
      if (filters.difficulty) {
        query.difficulty = filters.difficulty;
      }
      if (filters.category) {
        query.category = filters.category;
      }
      if (filters.subjectId) {
        query.subjectId = filters.subjectId;
      }
      if (filters.syllabusId) {
        query.syllabusId = filters.syllabusId;
      }
      if (filters.moduleId) {
        query.moduleId = filters.moduleId;
      }
      if (filters.isFree !== undefined) {
        query.isFree = filters.isFree;
      }

      const lessons = await Lesson.find(query)
        .sort({ order: 1, createdAt: -1 })
        .limit(filters.limit || 50);

      return {
        success: true,
        data: lessons,
        count: lessons.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch lessons: ${error}`);
    }
  }

  // Get a single lesson by ID
  static async getLessonById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid lesson ID");
      }

      const lesson = await Lesson.findOne({
        _id: id,
        isActive: true,
      });

      if (!lesson) {
        throw new Error("Lesson not found");
      }

      return {
        success: true,
        data: lesson,
      };
    } catch (error) {
      throw new Error(`Failed to fetch lesson: ${error}`);
    }
  }

  // Create a new lesson
  static async createLesson(lessonData: Partial<ILesson>) {
    try {
      const lesson = new Lesson(lessonData);
      await lesson.save();

      return {
        success: true,
        data: lesson,
      };
    } catch (error) {
      throw new Error(`Failed to create lesson: ${error}`);
    }
  }

  // Update a lesson
  static async updateLesson(id: string, updateData: Partial<ILesson>) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid lesson ID");
      }

      const lesson = await Lesson.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!lesson) {
        throw new Error("Lesson not found");
      }

      return {
        success: true,
        data: lesson,
      };
    } catch (error) {
      throw new Error(`Failed to update lesson: ${error}`);
    }
  }

  // Delete a lesson (soft delete)
  static async deleteLesson(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid lesson ID");
      }

      const lesson = await Lesson.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );

      if (!lesson) {
        throw new Error("Lesson not found");
      }

      return {
        success: true,
        message: "Lesson deleted successfully",
      };
    } catch (error) {
      throw new Error(`Failed to delete lesson: ${error}`);
    }
  }

  // Get lessons by syllabus
  static async getLessonsBySyllabus(syllabusId: string, limit: number = 50) {
    try {
      if (!Types.ObjectId.isValid(syllabusId)) {
        throw new Error("Invalid syllabus ID");
      }

      const lessons = await Lesson.find({
        syllabusId,
        isActive: true,
      })
        .sort({ order: 1 })
        .limit(limit);

      return {
        success: true,
        data: lessons,
        count: lessons.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch lessons by syllabus: ${error}`);
    }
  }

  // Get lessons by subject
  static async getLessonsBySubject(subjectId: string, limit: number = 50) {
    try {
      if (!Types.ObjectId.isValid(subjectId)) {
        throw new Error("Invalid subject ID");
      }

      const lessons = await Lesson.find({
        subjectId,
        isActive: true,
      })
        .sort({ order: 1 })
        .limit(limit);

      return {
        success: true,
        data: lessons,
        count: lessons.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch lessons by subject: ${error}`);
    }
  }

  // Get lessons by module
  static async getLessonsByModule(moduleId: string, limit: number = 50) {
    try {
      const lessons = await Lesson.find({
        moduleId,
        isActive: true,
      })
        .sort({ order: 1 })
        .limit(limit);

      return {
        success: true,
        data: lessons,
        count: lessons.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch lessons by module: ${error}`);
    }
  }

  // Get lessons by difficulty
  static async getLessonsByDifficulty(difficulty: string, limit: number = 20) {
    try {
      const lessons = await Lesson.find({
        difficulty,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .limit(limit);

      return {
        success: true,
        data: lessons,
        count: lessons.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch lessons by difficulty: ${error}`);
    }
  }

  // Get free lessons
  static async getFreeLessons(limit: number = 20) {
    try {
      const lessons = await Lesson.find({
        isActive: true,
        isFree: true,
      })
        .sort({ createdAt: -1 })
        .limit(limit);

      return {
        success: true,
        data: lessons,
        count: lessons.length,
      };
    } catch (error) {
      throw new Error(`Failed to fetch free lessons: ${error}`);
    }
  }
}
