import { Router } from "express";
import categoriesRouter from "./categories.js";
import subjectsRouter from "./subjects.js";
import syllabusRouter from "./syllabus.js";
import questionsRouter from "./questions.js";
import funRouter from "./fun.js";
import uploadRouter from "./upload.js";
import usersRouter from "./users.js";
import dashboardRouter from "./dashboard.js";
import quizQuestionsRouter from "./quizQuestions.js";
import puzzlesRouter from "./puzzles.js";
import memesRouter from "./memes.js";
import motivationsRouter from "./motivations.js";
import codingQuestionsRouter from "./codingQuestions.js";
import lessonsRouter from "./lessons.js";
import userProgressRouter from "./userProgress.js";
import modulesRouter from "./modules.js";
import lessonModelsRouter from "./lessonModels.js";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MindSpark Backend API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API routes
router.use("/categories", categoriesRouter);
router.use("/subjects", subjectsRouter);
router.use("/syllabus", syllabusRouter);
router.use("/questions", questionsRouter);
router.use("/fun", funRouter);
router.use("/upload", uploadRouter);
router.use("/users", usersRouter);
router.use("/dashboard", dashboardRouter);
router.use("/quiz-questions", quizQuestionsRouter);
router.use("/puzzles", puzzlesRouter);
router.use("/memes", memesRouter);
router.use("/motivations", motivationsRouter);
router.use("/coding-questions", codingQuestionsRouter);
router.use("/lessons", lessonsRouter);
router.use("/user-progress", userProgressRouter);
router.use("/modules", modulesRouter);
router.use("/lesson-models", lessonModelsRouter);

export default router;
