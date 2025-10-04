import { Router } from "express";
import { LessonController } from "../controllers/LessonController.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

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
router.use(authenticateToken);

// Admin-only routes
router.post("/", requireRole("admin"), LessonController.createLesson);
router.put("/:id", requireRole("admin"), LessonController.updateLesson);
router.delete("/:id", requireRole("admin"), LessonController.deleteLesson);

export default router;
