import mongoose from "mongoose";
import { Questionnaire } from "./src/models/Questionnaire";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const checkAndSeedQuestionnaires = async () => {
  try {
    console.log("🔍 Checking questionnaire data...");

    // Connect to MongoDB
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/mindspark";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Check existing questionnaires
    const count = await Questionnaire.countDocuments();
    console.log(`📊 Total questionnaires in database: ${count}`);

    if (count === 0) {
      console.log("🌱 No questionnaires found. Creating sample data...");

      // Create sample questionnaires
      const sampleQuestionnaires = [
        {
          title: "JavaScript Fundamentals Quiz",
          description: "Test your knowledge of JavaScript basics",
          difficulty: "Easy",
          questions: [
            {
              id: "q1",
              question: "What is JavaScript?",
              questionType: "multiple_choice",
              options: [
                { id: "opt1", text: "A programming language", isCorrect: true },
                { id: "opt2", text: "A markup language", isCorrect: false },
                { id: "opt3", text: "A styling language", isCorrect: false },
                { id: "opt4", text: "A database", isCorrect: false },
              ],
              correctAnswer: "A programming language",
              explanation:
                "JavaScript is a programming language used for web development.",
              points: 10,
              difficulty: "Easy",
              tags: ["javascript", "basics"],
              aiGenerated: false,
            },
            {
              id: "q2",
              question: "JavaScript is case-sensitive.",
              questionType: "true_false",
              correctAnswer: "True",
              explanation:
                "JavaScript is indeed case-sensitive, meaning 'myVar' and 'myvar' are different variables.",
              points: 10,
              difficulty: "Easy",
              tags: ["javascript", "syntax"],
              aiGenerated: false,
            },
          ],
          totalQuestions: 2,
          timeLimit: 10,
          isAIGenerated: false,
          isActive: true,
          tags: ["javascript", "fundamentals", "quiz"],
          createdBy: "system",
        },
        {
          title: "React Components Quiz",
          description: "Test your understanding of React components",
          difficulty: "Medium",
          questions: [
            {
              id: "q3",
              question: "What is a React component?",
              questionType: "short_answer",
              correctAnswer: "A reusable piece of UI",
              explanation:
                "React components are reusable pieces of UI that can be composed together.",
              points: 15,
              difficulty: "Medium",
              tags: ["react", "components"],
              aiGenerated: false,
            },
          ],
          totalQuestions: 1,
          timeLimit: 15,
          isAIGenerated: false,
          isActive: true,
          tags: ["react", "components", "quiz"],
          createdBy: "system",
        },
      ];

      // Insert sample data
      await Questionnaire.insertMany(sampleQuestionnaires);
      console.log("✅ Sample questionnaires created successfully!");

      // Verify insertion
      const newCount = await Questionnaire.countDocuments();
      console.log(`📊 Total questionnaires after seeding: ${newCount}`);
    } else {
      console.log("📋 Existing questionnaires found:");
      const questionnaires = await Questionnaire.find({}).select(
        "title difficulty isActive createdAt"
      );
      questionnaires.forEach((q, index) => {
        console.log(
          `${index + 1}. ${q.title} (${q.difficulty}) - Active: ${q.isActive}`
        );
      });
    }

    // Check active questionnaires specifically
    const activeCount = await Questionnaire.countDocuments({ isActive: true });
    console.log(`✅ Active questionnaires: ${activeCount}`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

// Run the script
checkAndSeedQuestionnaires();
