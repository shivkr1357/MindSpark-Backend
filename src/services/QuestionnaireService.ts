import { Questionnaire, IQuestionnaire } from "../models/Questionnaire";
import {
  AIService,
  AIGenerationRequest,
  AIGeneratedQuestion,
} from "./AIService";
import { Types } from "mongoose";

console.log("🔍 Questionnaire model imported:", !!Questionnaire);

export interface CreateQuestionnaireRequest {
  title: string;
  description: string;
  subjectId?: string;
  categoryId?: string;
  lessonId?: string;
  difficulty:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  timeLimit?: number;
  tags?: string[];
  createdBy: string;
}

export interface AIGenerateQuestionnaireRequest
  extends CreateQuestionnaireRequest {
  aiPrompt?: string;
  questionCount: number;
  questionTypes?: (
    | "multiple_choice"
    | "true_false"
    | "short_answer"
    | "essay"
  )[];
  subject?: string;
  topic?: string;
}

export interface QuestionnaireFilters {
  subjectId?: string;
  categoryId?: string;
  difficulty?: string;
  isAIGenerated?: boolean;
  isActive?: boolean;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
}

export class QuestionnaireService {
  private aiService: AIService | null;

  constructor() {
    console.log("🔧 Initializing QuestionnaireService...");
    this.aiService = null;
    try {
      this.aiService = new AIService();
      console.log("✅ AIService initialized successfully");
    } catch (error) {
      console.error("Failed to initialize AIService:", error);
      // Continue without AI service - questionnaires can still work for manual creation
      this.aiService = null;
    }
    console.log("✅ QuestionnaireService initialized successfully");
  }

  async createQuestionnaire(
    data: CreateQuestionnaireRequest
  ): Promise<IQuestionnaire> {
    try {
      const questionnaire = new Questionnaire({
        ...data,
        questions: [],
        totalQuestions: 0,
        isAIGenerated: false,
      });

      return await questionnaire.save();
    } catch (error) {
      console.error("Error creating questionnaire:", error);
      throw new Error("Failed to create questionnaire");
    }
  }

  async generateAIGuestionnaire(
    data: AIGenerateQuestionnaireRequest
  ): Promise<IQuestionnaire> {
    if (!this.aiService) {
      throw new Error(
        "AI service is not available. Please configure OpenAI API key."
      );
    }

    try {
      const aiRequest: AIGenerationRequest = {
        subject: data.subject,
        topic: data.topic,
        difficulty: data.difficulty,
        questionCount: data.questionCount,
        questionTypes: data.questionTypes,
        customPrompt: data.aiPrompt,
      };

      const aiQuestions = await this.aiService.generateQuestions(aiRequest);

      // Convert AI questions to questionnaire format
      const questions = aiQuestions.map((aiQ, index) => ({
        id: `q_${Date.now()}_${index}`,
        question: aiQ.question,
        questionType: aiQ.questionType,
        options:
          aiQ.options?.map((opt, optIndex) => ({
            id: `opt_${Date.now()}_${index}_${optIndex}`,
            text: opt.text,
            isCorrect: opt.isCorrect,
          })) || [],
        correctAnswer: aiQ.correctAnswer,
        explanation: aiQ.explanation,
        points: 1,
        difficulty: aiQ.difficulty as any,
        tags: aiQ.tags,
        aiGenerated: true,
      }));

      const questionnaire = new Questionnaire({
        title: data.title,
        description: data.description,
        subjectId: data.subjectId,
        categoryId: data.categoryId,
        lessonId: data.lessonId,
        difficulty: data.difficulty,
        questions,
        totalQuestions: questions.length,
        timeLimit: data.timeLimit,
        isAIGenerated: true,
        aiPrompt: data.aiPrompt,
        aiModel: "gpt-3.5-turbo",
        tags: data.tags || [],
        isActive: true,
        createdBy: data.createdBy,
      });

      return await questionnaire.save();
    } catch (error) {
      console.error("Error generating AI questionnaire:", error);
      throw new Error("Failed to generate AI questionnaire");
    }
  }

  async getQuestionnaires(filters: QuestionnaireFilters = {}): Promise<{
    questionnaires: IQuestionnaire[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      console.log(
        "🔍 QuestionnaireService.getQuestionnaires called with filters:",
        filters
      );

      const {
        subjectId,
        categoryId,
        difficulty,
        isAIGenerated,
        isActive,
        tags,
        search,
        page = 1,
        limit = 10,
      } = filters;

      const query: any = {};

      if (subjectId) query.subjectId = subjectId;
      if (categoryId) query.categoryId = categoryId;
      if (difficulty) query.difficulty = difficulty;
      if (isAIGenerated !== undefined) query.isAIGenerated = isAIGenerated;
      if (isActive !== undefined) query.isActive = isActive;
      if (tags && tags.length > 0) query.tags = { $in: tags };
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      const skip = (page - 1) * limit;
      console.log("🔍 Query:", query);
      console.log("🔍 About to call Questionnaire.countDocuments...");
      const total = await Questionnaire.countDocuments(query);
      console.log("✅ Total questionnaires found:", total);

      console.log("🔍 About to call Questionnaire.find...");
      const questionnaires = await Questionnaire.find(query)
        .populate("subjectId", "name")
        .populate("categoryId", "name")
        .populate("lessonId", "title")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return {
        questionnaires,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("Error fetching questionnaires:", error);
      throw new Error("Failed to fetch questionnaires");
    }
  }

  async getQuestionnaireById(id: string): Promise<IQuestionnaire | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid questionnaire ID");
      }

      return await Questionnaire.findById(id)
        .populate("subjectId", "name")
        .populate("categoryId", "name")
        .populate("lessonId", "title")
        .populate("createdBy", "name email");
    } catch (error) {
      console.error("Error fetching questionnaire by ID:", error);
      throw new Error("Failed to fetch questionnaire");
    }
  }

  async updateQuestionnaire(
    id: string,
    data: Partial<CreateQuestionnaireRequest>
  ): Promise<IQuestionnaire | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid questionnaire ID");
      }

      return await Questionnaire.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true }
      )
        .populate("subjectId", "name")
        .populate("categoryId", "name")
        .populate("lessonId", "title")
        .populate("createdBy", "name email");
    } catch (error) {
      console.error("Error updating questionnaire:", error);
      throw new Error("Failed to update questionnaire");
    }
  }

  async deleteQuestionnaire(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid questionnaire ID");
      }

      const result = await Questionnaire.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error("Error deleting questionnaire:", error);
      throw new Error("Failed to delete questionnaire");
    }
  }

  async addQuestionToQuestionnaire(
    questionnaireId: string,
    question: {
      question: string;
      questionType: "multiple_choice" | "true_false" | "short_answer" | "essay";
      options?: Array<{ text: string; isCorrect: boolean }>;
      correctAnswer?: string;
      explanation: string;
      points?: number;
      difficulty:
        | "Easy"
        | "Medium"
        | "Hard"
        | "Beginner"
        | "Intermediate"
        | "Advanced"
        | "Expert";
      tags?: string[];
    }
  ): Promise<IQuestionnaire | null> {
    try {
      if (!Types.ObjectId.isValid(questionnaireId)) {
        throw new Error("Invalid questionnaire ID");
      }

      const questionId = `q_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const options =
        question.options?.map((opt, index) => ({
          id: `opt_${Date.now()}_${index}`,
          text: opt.text,
          isCorrect: opt.isCorrect,
        })) || [];

      const newQuestion = {
        id: questionId,
        question: question.question,
        questionType: question.questionType,
        options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        points: question.points || 1,
        difficulty: question.difficulty,
        tags: question.tags || [],
        aiGenerated: false,
      };

      return await Questionnaire.findByIdAndUpdate(
        questionnaireId,
        {
          $push: { questions: newQuestion },
          $inc: { totalQuestions: 1 },
          updatedAt: new Date(),
        },
        { new: true }
      );
    } catch (error) {
      console.error("Error adding question to questionnaire:", error);
      throw new Error("Failed to add question to questionnaire");
    }
  }

  async getQuestionnaireStats(): Promise<{
    total: number;
    aiGenerated: number;
    byDifficulty: Record<string, number>;
    bySubject: Record<string, number>;
  }> {
    try {
      const total = await Questionnaire.countDocuments();
      const aiGenerated = await Questionnaire.countDocuments({
        isAIGenerated: true,
      });

      const byDifficulty = await Questionnaire.aggregate([
        { $group: { _id: "$difficulty", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      const bySubject = await Questionnaire.aggregate([
        { $match: { subjectId: { $exists: true } } },
        { $group: { _id: "$subjectId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);

      return {
        total,
        aiGenerated,
        byDifficulty: byDifficulty.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        bySubject: bySubject.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      };
    } catch (error) {
      console.error("Error fetching questionnaire stats:", error);
      throw new Error("Failed to fetch questionnaire statistics");
    }
  }
}
