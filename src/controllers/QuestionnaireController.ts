import { Request, Response } from "express";
import { QuestionnaireService } from "../services/QuestionnaireService";
import { AuthenticatedRequest } from "../types/index";

export class QuestionnaireController {
  private questionnaireService: QuestionnaireService | null;

  constructor() {
    console.log("🔧 Initializing QuestionnaireController...");
    try {
      this.questionnaireService = new QuestionnaireService();
      console.log("✅ QuestionnaireController initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize QuestionnaireService:", error);
      console.error("❌ Error details:", error);
      this.questionnaireService = null;
    }
  }

  async createQuestionnaire(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const data = {
        ...req.body,
        createdBy: req.user?.uid || "",
      };

      const questionnaire = await this.questionnaireService.createQuestionnaire(
        data
      );

      res.status(201).json({
        success: true,
        message: "Questionnaire created successfully",
        data: questionnaire,
      });
    } catch (error) {
      console.error("Error creating questionnaire:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create questionnaire",
      });
    }
  }

  async generateAIGuestionnaire(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const data = {
        ...req.body,
        createdBy: req.user?.uid || "",
      };

      const questionnaire =
        await this.questionnaireService.generateAIGuestionnaire(data);

      res.status(201).json({
        success: true,
        message: "AI questionnaire generated successfully",
        data: questionnaire,
      });
    } catch (error) {
      console.error("Error generating AI questionnaire:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate AI questionnaire",
      });
    }
  }

  // Debug endpoint to check database status
  async checkDatabaseStatus(req: Request, res: Response): Promise<void> {
    try {
      console.log("🔍 Checking database status...");

      if (!this.questionnaireService) {
        res.status(500).json({
          success: false,
          message: "Questionnaire service not available",
        });
        return;
      }

      // Import Questionnaire model directly for count
      const { Questionnaire } = await import("../models/Questionnaire");

      const totalCount = await Questionnaire.countDocuments();
      const activeCount = await Questionnaire.countDocuments({
        isActive: true,
      });
      const aiGeneratedCount = await Questionnaire.countDocuments({
        isAIGenerated: true,
      });

      res.status(200).json({
        success: true,
        message: "Database status retrieved",
        data: {
          totalQuestionnaires: totalCount,
          activeQuestionnaires: activeCount,
          aiGeneratedQuestionnaires: aiGeneratedCount,
          serviceStatus: this.questionnaireService
            ? "Available"
            : "Not Available",
        },
      });
    } catch (error) {
      console.error("Error checking database status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to check database status",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getQuestionnaires(req: Request, res: Response): Promise<void> {
    try {
      console.log("📋 Getting questionnaires...");

      if (!this.questionnaireService) {
        console.error("❌ QuestionnaireService is not initialized");
        res.status(500).json({
          success: false,
          message: "Questionnaire service is not available",
        });
        return;
      }

      const filters = {
        subjectId: req.query.subjectId as string,
        categoryId: req.query.categoryId as string,
        difficulty: req.query.difficulty as string,
        isAIGenerated: req.query.isAIGenerated
          ? req.query.isAIGenerated === "true"
          : undefined,
        isActive: req.query.isActive
          ? req.query.isActive === "true"
          : undefined,
        tags: req.query.tags
          ? (req.query.tags as string).split(",")
          : undefined,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      };

      console.log("🔍 Calling questionnaireService.getQuestionnaires...");
      const result = await this.questionnaireService.getQuestionnaires(filters);
      console.log("✅ Successfully fetched questionnaires");

      res.status(200).json({
        success: true,
        message: "Questionnaires fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error fetching questionnaires:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch questionnaires",
      });
    }
  }

  async getQuestionnaireById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const questionnaire =
        await this.questionnaireService.getQuestionnaireById(id);

      if (!questionnaire) {
        res.status(404).json({
          success: false,
          message: "Questionnaire not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Questionnaire fetched successfully",
        data: questionnaire,
      });
    } catch (error) {
      console.error("Error fetching questionnaire by ID:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch questionnaire",
      });
    }
  }

  async updateQuestionnaire(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      const questionnaire = await this.questionnaireService.updateQuestionnaire(
        id,
        data
      );

      if (!questionnaire) {
        res.status(404).json({
          success: false,
          message: "Questionnaire not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Questionnaire updated successfully",
        data: questionnaire,
      });
    } catch (error) {
      console.error("Error updating questionnaire:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update questionnaire",
      });
    }
  }

  async deleteQuestionnaire(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.questionnaireService.deleteQuestionnaire(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: "Questionnaire not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Questionnaire deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting questionnaire:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete questionnaire",
      });
    }
  }

  async addQuestionToQuestionnaire(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const questionData = req.body;

      const questionnaire =
        await this.questionnaireService.addQuestionToQuestionnaire(
          id,
          questionData
        );

      if (!questionnaire) {
        res.status(404).json({
          success: false,
          message: "Questionnaire not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Question added to questionnaire successfully",
        data: questionnaire,
      });
    } catch (error) {
      console.error("Error adding question to questionnaire:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to add question to questionnaire",
      });
    }
  }

  async getQuestionnaireStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.questionnaireService.getQuestionnaireStats();

      res.status(200).json({
        success: true,
        message: "Questionnaire statistics fetched successfully",
        data: stats,
      });
    } catch (error) {
      console.error("Error fetching questionnaire stats:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch questionnaire statistics",
      });
    }
  }

  async getQuestionnairesBySubject(req: Request, res: Response): Promise<void> {
    try {
      const { subjectId } = req.params;
      const filters = {
        subjectId,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      };

      const result = await this.questionnaireService.getQuestionnaires(filters);

      res.status(200).json({
        success: true,
        message: "Questionnaires fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error fetching questionnaires by subject:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch questionnaires",
      });
    }
  }

  async getAIGeneratedQuestionnaires(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const filters = {
        isAIGenerated: true,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      };

      const result = await this.questionnaireService.getQuestionnaires(filters);

      res.status(200).json({
        success: true,
        message: "AI-generated questionnaires fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error fetching AI-generated questionnaires:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch AI-generated questionnaires",
      });
    }
  }
}
