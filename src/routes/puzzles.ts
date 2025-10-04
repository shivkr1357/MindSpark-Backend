import { Router } from "express";
import { PuzzleController } from "../controllers/PuzzleController.js";
import { authenticateToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();

// Public routes
router.get("/", PuzzleController.getAllPuzzles);
router.get("/type/:type", PuzzleController.getPuzzlesByType);
router.get("/difficulty/:difficulty", PuzzleController.getPuzzlesByDifficulty);
router.get("/:id", PuzzleController.getPuzzleById);

// Protected routes (require authentication)
router.use(authenticateToken);

// Admin-only routes
router.post("/", requireRole("admin"), PuzzleController.createPuzzle);
router.put("/:id", requireRole("admin"), PuzzleController.updatePuzzle);
router.delete("/:id", requireRole("admin"), PuzzleController.deletePuzzle);

export default router;
