import OpenAI from "openai";

export interface AIGenerationRequest {
  subject?: string;
  topic?: string;
  difficulty:
    | "Easy"
    | "Medium"
    | "Hard"
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  questionCount: number;
  questionTypes?: (
    | "multiple_choice"
    | "true_false"
    | "short_answer"
    | "essay"
  )[];
  customPrompt?: string;
}

export interface AIGeneratedQuestion {
  question: string;
  questionType: "multiple_choice" | "true_false" | "short_answer" | "essay";
  options?: Array<{
    text: string;
    isCorrect: boolean;
  }>;
  correctAnswer?: string;
  explanation: string;
  difficulty: string;
  tags: string[];
}

export class AIService {
  private openai: OpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      console.warn(
        "⚠️ OpenAI API key not found. AI features will be disabled."
      );
    }
  }

  async generateQuestions(
    request: AIGenerationRequest
  ): Promise<AIGeneratedQuestion[]> {
    if (!this.openai) {
      throw new Error(
        "OpenAI API key not configured. AI features are disabled."
      );
    }

    try {
      const prompt = this.buildPrompt(request);

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert educational content creator. Generate high-quality educational questions in JSON format. Always provide clear explanations and appropriate difficulty levels.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error("No response from AI service");
      }

      // Parse the JSON response
      const questions = JSON.parse(response);
      return this.validateAndFormatQuestions(questions);
    } catch (error) {
      console.error("Error generating questions with AI:", error);
      throw new Error("Failed to generate questions with AI");
    }
  }

  private buildPrompt(request: AIGenerationRequest): string {
    const {
      subject,
      topic,
      difficulty,
      questionCount,
      questionTypes,
      customPrompt,
    } = request;

    if (customPrompt) {
      return customPrompt;
    }

    const subjectText = subject ? `about ${subject}` : "";
    const topicText = topic ? `focused on ${topic}` : "";
    const typesText = questionTypes
      ? `of types: ${questionTypes.join(", ")}`
      : "of various types";

    return `Generate ${questionCount} educational questions ${subjectText} ${topicText} at ${difficulty} difficulty level ${typesText}.

Requirements:
- Questions should be clear, well-structured, and educationally valuable
- For multiple choice questions, provide 4 options with only one correct answer
- For true/false questions, make the statement clear and unambiguous
- For short answer questions, provide a clear expected answer
- For essay questions, provide a comprehensive prompt
- Include detailed explanations for each question
- Add relevant tags for categorization
- Ensure questions are appropriate for ${difficulty} level

Return the response as a JSON array with this structure:
[
  {
    "question": "Question text here",
    "questionType": "multiple_choice|true_false|short_answer|essay",
    "options": [
      {"text": "Option 1", "isCorrect": false},
      {"text": "Option 2", "isCorrect": true},
      {"text": "Option 3", "isCorrect": false},
      {"text": "Option 4", "isCorrect": false}
    ],
    "correctAnswer": "Option 2",
    "explanation": "Detailed explanation of the correct answer",
    "difficulty": "${difficulty}",
    "tags": ["tag1", "tag2", "tag3"]
  }
]

Generate exactly ${questionCount} questions.`;
  }

  private validateAndFormatQuestions(questions: any[]): AIGeneratedQuestion[] {
    if (!Array.isArray(questions)) {
      throw new Error("AI response is not an array");
    }

    return questions.map((q, index) => {
      if (!q.question || !q.questionType || !q.explanation) {
        throw new Error(`Invalid question structure at index ${index}`);
      }

      return {
        question: q.question,
        questionType: q.questionType,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty || "Medium",
        tags: q.tags || [],
      };
    });
  }

  async generateQuestionnairePrompt(
    request: AIGenerationRequest
  ): Promise<string> {
    const { subject, topic, difficulty, questionCount, questionTypes } =
      request;

    const subjectText = subject ? `about ${subject}` : "";
    const topicText = topic ? `focused on ${topic}` : "";
    const typesText = questionTypes
      ? `of types: ${questionTypes.join(", ")}`
      : "of various types";

    return `Create a comprehensive questionnaire ${subjectText} ${topicText} at ${difficulty} difficulty level ${typesText} with ${questionCount} questions.`;
  }
}
