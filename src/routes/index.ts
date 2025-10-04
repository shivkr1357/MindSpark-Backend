import { Router } from "express";
import subjectsRouter from "./subjects.js";
import syllabusRouter from "./syllabus.js";
import questionsRouter from "./questions.js";
import funRouter from "./fun.js";
import uploadRouter from "./upload.js";
import usersRouter from "./users.js";
import dashboardRouter from "./dashboard.js";

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
router.use("/subjects", subjectsRouter);
router.use("/syllabus", syllabusRouter);
router.use("/questions", questionsRouter);
router.use("/fun", funRouter);
router.use("/upload", uploadRouter);
router.use("/users", usersRouter);
router.use("/dashboard", dashboardRouter);

export default router;
