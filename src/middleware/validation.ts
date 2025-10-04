import { Request, Response, NextFunction } from "express";
import { body, param, query, validationResult } from "express-validator";

export class ValidationMiddleware {
  /**
   * Handle validation errors
   */
  public static handleValidationErrors(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
      return;
    }
    next();
  }

  /**
   * Validate subject creation
   */
  public static validateCreateSubject() {
    return [
      body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 100 })
        .withMessage("Title must be less than 100 characters"),
      body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 500 })
        .withMessage("Description must be less than 500 characters"),
      body("difficulty")
        .isIn([
          "Easy",
          "Medium",
          "Hard",
          "Beginner",
          "Intermediate",
          "Advanced",
          "Expert",
        ])
        .withMessage("Invalid difficulty level"),
      body("estimatedTime")
        .optional()
        .isLength({ max: 50 })
        .withMessage("Estimated time must be less than 50 characters"),
      ValidationMiddleware.handleValidationErrors,
    ];
  }

  /**
   * Validate syllabus creation
   */
  public static validateCreateSyllabus() {
    return [
      body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 100 })
        .withMessage("Title must be less than 100 characters"),
      body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description must be less than 500 characters"),
      body("modules")
        .isArray({ min: 1 })
        .withMessage("At least one module is required"),
      body("modules.*.title")
        .trim()
        .notEmpty()
        .withMessage("Module title is required")
        .isLength({ max: 100 })
        .withMessage("Module title must be less than 100 characters"),
      body("modules.*.lessons")
        .isArray({ min: 1 })
        .withMessage("Each module must have at least one lesson"),
      body("modules.*.lessons.*.title")
        .trim()
        .notEmpty()
        .withMessage("Lesson title is required")
        .isLength({ max: 100 })
        .withMessage("Lesson title must be less than 100 characters"),
      body("modules.*.lessons.*.content")
        .trim()
        .notEmpty()
        .withMessage("Lesson content is required"),
      body("difficulty")
        .isIn([
          "Easy",
          "Medium",
          "Hard",
          "Beginner",
          "Intermediate",
          "Advanced",
          "Expert",
        ])
        .withMessage("Invalid difficulty level"),
      ValidationMiddleware.handleValidationErrors,
    ];
  }

  /**
   * Validate question creation
   */
  public static validateCreateQuestion() {
    return [
      body("question")
        .trim()
        .notEmpty()
        .withMessage("Question is required")
        .isLength({ max: 1000 })
        .withMessage("Question must be less than 1000 characters"),
      body("options")
        .isArray({ min: 2, max: 6 })
        .withMessage("Options must contain between 2 and 6 choices"),
      body("options.*")
        .trim()
        .notEmpty()
        .withMessage("Option text is required")
        .isLength({ max: 200 })
        .withMessage("Option text must be less than 200 characters"),
      body("correctAnswer")
        .isInt({ min: 0 })
        .withMessage("Correct answer must be a valid index"),
      body("difficulty")
        .isIn([
          "Easy",
          "Medium",
          "Hard",
          "Beginner",
          "Intermediate",
          "Advanced",
          "Expert",
        ])
        .withMessage("Invalid difficulty level"),
      body("explanation")
        .trim()
        .notEmpty()
        .withMessage("Explanation is required")
        .isLength({ max: 1000 })
        .withMessage("Explanation must be less than 1000 characters"),
      body("category")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Category must be less than 50 characters"),
      ValidationMiddleware.handleValidationErrors,
    ];
  }

  /**
   * Validate fun content creation
   */
  public static validateCreateFunContent() {
    return [
      body("type")
        .isIn(["quiz", "puzzle", "meme", "motivational"])
        .withMessage("Invalid content type"),
      body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 100 })
        .withMessage("Title must be less than 100 characters"),
      body("content")
        .trim()
        .notEmpty()
        .withMessage("Content is required")
        .isLength({ max: 2000 })
        .withMessage("Content must be less than 2000 characters"),
      body("difficulty")
        .optional()
        .isIn([
          "Easy",
          "Medium",
          "Hard",
          "Beginner",
          "Intermediate",
          "Advanced",
          "Expert",
        ])
        .withMessage("Invalid difficulty level"),
      ValidationMiddleware.handleValidationErrors,
    ];
  }

  /**
   * Validate MongoDB ObjectId
   */
  public static validateObjectId(field: string = "id") {
    return [
      param(field).isMongoId().withMessage(`Invalid ${field}`),
      ValidationMiddleware.handleValidationErrors,
    ];
  }

  /**
   * Validate pagination parameters
   */
  public static validatePagination() {
    return [
      query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
      query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),
      ValidationMiddleware.handleValidationErrors,
    ];
  }

  /**
   * Validate difficulty parameter
   */
  public static validateDifficulty() {
    return [
      query("difficulty")
        .optional()
        .isIn([
          "Easy",
          "Medium",
          "Hard",
          "Beginner",
          "Intermediate",
          "Advanced",
          "Expert",
        ])
        .withMessage("Invalid difficulty level"),
      ValidationMiddleware.handleValidationErrors,
    ];
  }

  /**
   * Validate content type parameter
   */
  public static validateContentType() {
    return [
      query("type")
        .optional()
        .isIn(["quiz", "puzzle", "meme", "motivational"])
        .withMessage("Invalid content type"),
      ValidationMiddleware.handleValidationErrors,
    ];
  }
}
