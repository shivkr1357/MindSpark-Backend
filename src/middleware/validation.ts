import { Request, Response, NextFunction } from "express";
import { body, param, query, validationResult } from "express-validator";

export class ValidationMiddleware {
  /**
   * Handle validation errors
   */
  public static handleValidationErrors(
    req: Request,
    res: Response,
    next: NextFunction
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
   * Validate category creation
   */
  public static validateCreateCategory() {
    return [
      body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ max: 100 })
        .withMessage("Name must be less than 100 characters"),
      body("slug")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Slug must be less than 100 characters")
        .matches(/^[a-z0-9-]+$/)
        .withMessage(
          "Slug can only contain lowercase letters, numbers, and hyphens"
        ),
      body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 500 })
        .withMessage("Description must be less than 500 characters"),
      body("icon").optional().isString().trim(),
      body("color")
        .optional()
        .matches(/^#[0-9A-F]{6}$/i)
        .withMessage("Color must be a valid hex color code"),
      body("order")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Order must be a non-negative integer"),
      body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean"),
      body("parentCategoryId")
        .optional()
        .custom((value) => value === null || typeof value === "string")
        .withMessage("parentCategoryId must be a string or null"),
      ValidationMiddleware.handleValidationErrors,
    ];
  }

  /**
   * Validate category update
   */
  public static validateUpdateCategory() {
    return [
      body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
        .isLength({ max: 100 })
        .withMessage("Name must be less than 100 characters"),
      body("slug")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Slug must be less than 100 characters")
        .matches(/^[a-z0-9-]+$/)
        .withMessage(
          "Slug can only contain lowercase letters, numbers, and hyphens"
        ),
      body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description cannot be empty")
        .isLength({ max: 500 })
        .withMessage("Description must be less than 500 characters"),
      body("icon").optional().isString().trim(),
      body("color")
        .optional()
        .matches(/^#[0-9A-F]{6}$/i)
        .withMessage("Color must be a valid hex color code"),
      body("order")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Order must be a non-negative integer"),
      body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean"),
      body("parentCategoryId")
        .optional()
        .custom((value) => value === null || typeof value === "string")
        .withMessage("parentCategoryId must be a string or null"),
      ValidationMiddleware.handleValidationErrors,
    ];
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
        .isLength({ max: 5000 })
        .withMessage("Description must be less than 500 characters"),
      body("categoryId")
        .optional()
        .isString()
        .withMessage("categoryId must be a string"),
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
      body("totalDuration")
        .optional()
        .trim()
        .isString()
        .withMessage("Total duration must be a string")
        .isLength({ max: 50 })
        .withMessage("Total duration must be less than 50 characters"),
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
      body("categoryId")
        .optional()
        .isString()
        .withMessage("categoryId must be a string"),
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

  /**
   * Validate questionnaire creation
   */
  public static validateCreateQuestionnaire() {
    return [
      body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 200 })
        .withMessage("Title must be less than 200 characters"),
      body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 1000 })
        .withMessage("Description must be less than 1000 characters"),
      body("subjectId")
        .optional()
        .isString()
        .withMessage("subjectId must be a string"),
      body("categoryId")
        .optional()
        .isString()
        .withMessage("categoryId must be a string"),
      body("lessonId")
        .optional()
        .isString()
        .withMessage("lessonId must be a string"),
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
      body("timeLimit")
        .optional()
        .isInt({ min: 1, max: 180 })
        .withMessage("Time limit must be between 1 and 180 minutes"),
      body("tags").optional().isArray().withMessage("Tags must be an array"),
      body("tags.*")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Each tag must be less than 50 characters"),
      ValidationMiddleware.handleValidationErrors,
    ];
  }

  /**
   * Validate AI questionnaire generation
   */
  public static validateAIGenerateQuestionnaire() {
    return [
      body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 200 })
        .withMessage("Title must be less than 200 characters"),
      body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 1000 })
        .withMessage("Description must be less than 1000 characters"),
      body("subjectId")
        .optional()
        .isString()
        .withMessage("subjectId must be a string"),
      body("categoryId")
        .optional()
        .isString()
        .withMessage("categoryId must be a string"),
      body("lessonId")
        .optional()
        .isString()
        .withMessage("lessonId must be a string"),
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
      body("questionCount")
        .isInt({ min: 1, max: 50 })
        .withMessage("Question count must be between 1 and 50"),
      body("questionTypes")
        .optional()
        .isArray()
        .withMessage("Question types must be an array"),
      body("questionTypes.*")
        .optional()
        .isIn(["multiple_choice", "true_false", "short_answer", "essay"])
        .withMessage("Invalid question type"),
      body("subject")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Subject must be less than 100 characters"),
      body("topic")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Topic must be less than 100 characters"),
      body("aiPrompt")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 2000 })
        .withMessage("AI prompt must be less than 2000 characters"),
      body("timeLimit")
        .optional()
        .isInt({ min: 1, max: 180 })
        .withMessage("Time limit must be between 1 and 180 minutes"),
      body("tags").optional().isArray().withMessage("Tags must be an array"),
      body("tags.*")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Each tag must be less than 50 characters"),
      ValidationMiddleware.handleValidationErrors,
    ];
  }

  /**
   * Validate questionnaire update
   */
  public static validateUpdateQuestionnaire() {
    return [
      body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty")
        .isLength({ max: 200 })
        .withMessage("Title must be less than 200 characters"),
      body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description cannot be empty")
        .isLength({ max: 1000 })
        .withMessage("Description must be less than 1000 characters"),
      body("subjectId")
        .optional()
        .isString()
        .withMessage("subjectId must be a string"),
      body("categoryId")
        .optional()
        .isString()
        .withMessage("categoryId must be a string"),
      body("lessonId")
        .optional()
        .isString()
        .withMessage("lessonId must be a string"),
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
      body("timeLimit")
        .optional()
        .isInt({ min: 1, max: 180 })
        .withMessage("Time limit must be between 1 and 180 minutes"),
      body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean"),
      body("tags").optional().isArray().withMessage("Tags must be an array"),
      body("tags.*")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Each tag must be less than 50 characters"),
      ValidationMiddleware.handleValidationErrors,
    ];
  }

  /**
   * Validate adding question to questionnaire
   */
  public static validateAddQuestion() {
    return [
      body("question")
        .trim()
        .notEmpty()
        .withMessage("Question is required")
        .isLength({ max: 2000 })
        .withMessage("Question must be less than 2000 characters"),
      body("questionType")
        .isIn(["multiple_choice", "true_false", "short_answer", "essay"])
        .withMessage("Invalid question type"),
      body("options")
        .optional()
        .isArray()
        .withMessage("Options must be an array"),
      body("options.*.text")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Option text is required")
        .isLength({ max: 500 })
        .withMessage("Option text must be less than 500 characters"),
      body("options.*.isCorrect")
        .optional()
        .isBoolean()
        .withMessage("isCorrect must be a boolean"),
      body("correctAnswer")
        .optional()
        .isString()
        .withMessage("Correct answer must be a string"),
      body("explanation")
        .trim()
        .notEmpty()
        .withMessage("Explanation is required")
        .isLength({ max: 2000 })
        .withMessage("Explanation must be less than 2000 characters"),
      body("points")
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage("Points must be between 1 and 10"),
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
      body("tags").optional().isArray().withMessage("Tags must be an array"),
      body("tags.*")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Each tag must be less than 50 characters"),
      ValidationMiddleware.handleValidationErrors,
    ];
  }
}
