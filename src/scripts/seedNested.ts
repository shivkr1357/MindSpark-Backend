import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import {
  QuizQuestion,
  Puzzle,
  Meme,
  Motivation,
  CodingQuestion,
  Lesson,
} from "../models/index.js";
import { Subject, InterviewQuestion, FunContent } from "../models/index.js";

// Load environment variables
dotenv.config();

async function getExistingData() {
  // Get existing data from database
  const subjects = await Subject.find({});
  const interviewQuestions = await InterviewQuestion.find({});
  const funContent = await FunContent.find({});

  const subjectMap = new Map();
  subjects.forEach((subject) => {
    subjectMap.set(subject.title, subject._id.toString());
  });

  const interviewQuestionMap = new Map();
  interviewQuestions.forEach((question) => {
    interviewQuestionMap.set(
      (question as any).title,
      (question._id as any).toString()
    );
  });

  const funContentMap = new Map();
  funContent.forEach((content) => {
    funContentMap.set(content.title, content._id.toString());
  });

  return { subjectMap, interviewQuestionMap, funContentMap };
}

const quizQuestionsData = [
  {
    title: "JavaScript Basics Quiz",
    description: "Test your JavaScript fundamentals knowledge",
    totalQuestions: 2,
    difficulty: "Easy",
    category: "JavaScript Fundamentals",
    timeLimit: 60, // 1 minute (max 120)
    questions: [
      {
        id: 1,
        question:
          "What is the correct way to declare a variable in JavaScript?",
        options: [
          { id: 1, text: "var name = 'John';", isCorrect: true },
          { id: 2, text: "variable name = 'John';", isCorrect: false },
          { id: 3, text: "v name = 'John';", isCorrect: false },
          { id: 4, text: "declare name = 'John';", isCorrect: false },
        ],
        correctAnswer: 0,
        explanation: "The correct way is using var, let, or const keywords.",
      },
      {
        id: 2,
        question: "Which operator is used for strict equality?",
        options: [
          { id: 1, text: "==", isCorrect: false },
          { id: 2, text: "===", isCorrect: true },
          { id: 3, text: "=", isCorrect: false },
          { id: 4, text: "!=", isCorrect: false },
        ],
        correctAnswer: 1,
        explanation:
          "=== is the strict equality operator that checks both value and type.",
      },
    ],
    subjectId: "", // Will be filled from subjectMap
    funContentId: "", // Will be filled from funContentMap
    isActive: true,
    createdBy: "system",
  },
];

const puzzlesData = [
  {
    title: "React Component Puzzle",
    description: "Arrange React components in the correct order",
    type: "code",
    difficulty: "Medium",
    category: "React Components",
    puzzleData: {
      question:
        "Arrange these React components in the correct hierarchical order:",
      sequence: ["App", "Header", "Main", "Footer"],
    },
    solution: "App -> Header -> Main -> Footer",
    hints: ["Start with the root component", "Header comes before Main"],
    points: 20,
    subjectId: "", // Will be filled from subjectMap
    funContentId: "", // Will be filled from funContentMap
    isActive: true,
    createdBy: "system",
  },
];

const memesData = [
  {
    title: "JavaScript Debugging Meme",
    description: "When console.log doesn't work",
    type: "text",
    category: "programming",
    content: {
      text: "Me: console.log('Hello World');\nConsole: [object Object]",
      caption: "The eternal struggle of JavaScript debugging",
    },
    tags: ["javascript", "debugging", "console"],
    likes: 0,
    shares: 0,
    views: 0,
    difficulty: "Easy",
    isNSFW: false,
    subjectId: "", // Will be filled from subjectMap
    funContentId: "", // Will be filled from funContentMap
    isActive: true,
    createdBy: "system",
  },
];

const motivationsData = [
  {
    title: "Daily Programming Motivation",
    content: "Code is like humor. When you have to explain it, it's bad.",
    type: "quote",
    category: "coding",
    tags: ["motivation", "programming", "quote"],
    difficulty: "Easy",
    likes: 0,
    shares: 0,
    views: 0,
    bookmarks: 0,
    isFeatured: false,
    subjectId: "", // Will be filled from subjectMap
    funContentId: "", // Will be filled from funContentMap
    isActive: true,
    createdBy: "system",
  },
];

const codingQuestionsData = [
  {
    title: "Two Sum Problem",
    description: "Classic coding interview question",
    problem:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "Easy",
    category: "Array",
    language: "javascript",
    tags: ["array", "hash-table", "two-pointers"],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
    ],
    testCases: [
      {
        input: "[2,7,11,15], 9",
        expectedOutput: "[0,1]",
        isPublic: true,
      },
    ],
    hints: [
      "Use a hash map to store complements",
      "Check if complement exists before adding",
    ],
    solution:
      "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}",
    timeLimit: 30,
    memoryLimit: 256,
    points: 100,
    subjectId: "", // Will be filled from subjectMap
    interviewQuestionId: "", // Will be filled from interviewQuestionMap
    isActive: true,
    createdBy: "system",
  },
];

const lessonsData = [
  {
    title: "Introduction to JavaScript Variables",
    description: "Learn about JavaScript variable declarations",
    content: [
      {
        type: "text",
        title: "Variable Declaration Basics",
        content:
          "In JavaScript, variables can be declared using var, let, or const keywords.",
        order: 1,
      },
      {
        type: "code",
        title: "Variable Examples",
        content: "let name = 'John';\nconst age = 25;\nvar city = 'New York';",
        order: 2,
      },
    ],
    duration: 30,
    difficulty: "Beginner",
    category: "JavaScript Fundamentals",
    tags: ["javascript", "variables", "basics"],
    objectives: [
      "Understand variable declaration",
      "Learn about var, let, const",
    ],
    prerequisites: ["Basic programming knowledge"],
    resources: [],
    exercises: [],
    order: 1,
    isFree: true,
    subjectId: "", // Will be filled from subjectMap
    isActive: true,
    createdBy: "system",
  },
];

async function seedNested() {
  try {
    console.log("🌱 Starting nested data seeding...");

    await connectDB();

    // Get existing data
    const { subjectMap, interviewQuestionMap, funContentMap } =
      await getExistingData();
    console.log("📋 Retrieved mappings:", {
      subjects: Object.fromEntries(subjectMap),
      interviewQuestions: Object.fromEntries(interviewQuestionMap),
      funContent: Object.fromEntries(funContentMap),
    });

    // Clear existing nested data
    console.log("🧹 Clearing existing nested data...");
    await QuizQuestion.deleteMany({});
    await Puzzle.deleteMany({});
    await Meme.deleteMany({});
    await Motivation.deleteMany({});
    await CodingQuestion.deleteMany({});
    await Lesson.deleteMany({});

    // Create quiz questions
    console.log("🧩 Creating quiz questions...");
    const quizQuestionsWithIds = quizQuestionsData.map((qq) => {
      const subjectId = subjectMap.get("JavaScript Fundamentals") || "";
      const funContentId = funContentMap.get("JavaScript Quiz Challenge") || "";
      return { ...qq, subjectId, funContentId };
    });
    const createdQuizQuestions = await QuizQuestion.insertMany(
      quizQuestionsWithIds
    );
    console.log(`✅ Created ${createdQuizQuestions.length} quiz questions`);

    // Create puzzles
    console.log("🧩 Creating puzzles...");
    const puzzlesWithIds = puzzlesData.map((puzzle) => {
      const subjectId = subjectMap.get("React & React Native") || "";
      const funContentId = funContentMap.get("React Puzzle Game") || "";
      return { ...puzzle, subjectId, funContentId };
    });
    const createdPuzzles = await Puzzle.insertMany(puzzlesWithIds);
    console.log(`✅ Created ${createdPuzzles.length} puzzles`);

    // Create memes
    console.log("😂 Creating memes...");
    const memesWithIds = memesData.map((meme) => {
      const subjectId = subjectMap.get("JavaScript Fundamentals") || "";
      const funContentId =
        funContentMap.get("Programming Meme Collection") || "";
      return { ...meme, subjectId, funContentId };
    });
    const createdMemes = await Meme.insertMany(memesWithIds);
    console.log(`✅ Created ${createdMemes.length} memes`);

    // Create motivational content
    console.log("💪 Creating motivational content...");
    const motivationsWithIds = motivationsData.map((motivation) => {
      const subjectId = subjectMap.get("JavaScript Fundamentals") || "";
      const funContentId =
        funContentMap.get("Programming Meme Collection") || "";
      return { ...motivation, subjectId, funContentId };
    });
    const createdMotivations = await Motivation.insertMany(motivationsWithIds);
    console.log(`✅ Created ${createdMotivations.length} motivational content`);

    // Create coding questions
    console.log("💻 Creating coding questions...");
    const codingQuestionsWithIds = codingQuestionsData.map((cq) => {
      const subjectId = subjectMap.get("Data Structures & Algorithms") || "";
      const interviewQuestionId =
        interviewQuestionMap.get(
          "What is the difference between let, const, and var?"
        ) || "";
      return { ...cq, subjectId, interviewQuestionId };
    });
    const createdCodingQuestions = await CodingQuestion.insertMany(
      codingQuestionsWithIds
    );
    console.log(`✅ Created ${createdCodingQuestions.length} coding questions`);

    // Create lessons
    console.log("📖 Creating lessons...");
    const lessonsWithIds = lessonsData.map((lesson) => {
      const subjectId = subjectMap.get("JavaScript Fundamentals") || "";
      return { ...lesson, subjectId };
    });
    const createdLessons = await Lesson.insertMany(lessonsWithIds);
    console.log(`✅ Created ${createdLessons.length} lessons`);

    console.log("🎉 Nested data seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding nested data:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database connection closed");
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedNested();
}

export default seedNested;
