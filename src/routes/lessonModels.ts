import { Router } from "express";
import { LessonModelController } from "../controllers/LessonModelController.js";
import { AuthMiddleware } from "../middleware/index.js";

const router = Router();
const lessonController = new LessonModelController();

// Apply authentication middleware to all routes
router.use(AuthMiddleware.verifyToken as any);

// Get all lessons for a module
router.get("/module/:moduleId", lessonController.getLessonsByModule as any);

// Get all lessons for a syllabus
router.get(
  "/syllabus/:syllabusId",
  lessonController.getLessonsBySyllabus as any
);

// Get lesson by ID
router.get("/:id", lessonController.getLessonById as any);

// Create a new lesson
router.post("/:moduleId", lessonController.createLesson as any);

// Update a lesson
router.put("/:id", lessonController.updateLesson as any);

// Delete a lesson
router.delete("/:id", lessonController.deleteLesson as any);

// Reorder lessons
router.post("/:moduleId/reorder", lessonController.reorderLessons as any);

export default router;
