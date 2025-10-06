import { Router } from "express";
import { PuzzleController } from "../controllers/PuzzleController.js";
import { AuthMiddleware } from "../middleware/index.js";

const router = Router();

// Public routes
router.get("/", PuzzleController.getAllPuzzles);
router.get("/type/:type", PuzzleController.getPuzzlesByType);
router.get("/difficulty/:difficulty", PuzzleController.getPuzzlesByDifficulty);
router.get("/:id", PuzzleController.getPuzzleById);

// Protected routes (require authentication)
router.use(AuthMiddleware.verifyToken as any);

// Admin-only routes
router.post("/", PuzzleController.createPuzzle);
router.put("/:id", PuzzleController.updatePuzzle);
router.delete("/:id", PuzzleController.deletePuzzle);

export default router;
