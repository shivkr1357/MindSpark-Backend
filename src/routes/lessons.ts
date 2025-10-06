import { Router } from "express";
import { LessonController } from "../controllers/LessonController.js";
import { AuthMiddleware } from "../middleware/index.js";

const router = Router();

// Public routes
router.get("/", LessonController.getAllLessons);
router.get("/free", LessonController.getFreeLessons);
router.get("/difficulty/:difficulty", LessonController.getLessonsByDifficulty);
router.get("/subject/:subjectId", LessonController.getLessonsBySubject);
router.get("/syllabus/:syllabusId", LessonController.getLessonsBySyllabus);
router.get("/module/:moduleId", LessonController.getLessonsByModule);
router.get("/:id", LessonController.getLessonById);

// Protected routes (require authentication)
router.use(AuthMiddleware.verifyToken as any);

// Admin-only routes
router.post("/", LessonController.createLesson);
router.put("/:id", LessonController.updateLesson);
router.delete("/:id", LessonController.deleteLesson);

export default router;
