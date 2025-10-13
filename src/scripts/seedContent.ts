import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { InterviewQuestion, FunContent, Syllabus } from "../models/index.js";
import { Subject } from "../models/index.js";

// Load environment variables
dotenv.config();

async function getExistingData() {
  // Get existing subjects from database
  const subjects = await Subject.find({});
  const subjectMap = new Map();
  subjects.forEach((subject) => {
    subjectMap.set(subject.title, subject._id.toString());
  });

  return { subjectMap };
}

const interviewQuestionsData = [
  {
    title: "What is the difference between let, const, and var?",
    description:
      "Explain the differences between JavaScript variable declarations",
    category: "JavaScript Fundamentals",
    difficulty: "Easy",
    question:
      "What are the key differences between let, const, and var in JavaScript?",
    answer:
      "The main differences are: 1) Scope: var is function-scoped, let/const are block-scoped. 2) Hoisting: var is hoisted and initialized with undefined, let/const are hoisted but not initialized. 3) Reassignment: var and let can be reassigned, const cannot. 4) Redeclaration: var can be redeclared, let/const cannot in the same scope.",
    explanation:
      "Understanding variable declarations is fundamental to JavaScript programming.",
    options: [
      "var is function-scoped, let/const are block-scoped",
      "var is block-scoped, let/const are function-scoped",
      "All three have the same scope behavior",
      "Only const is block-scoped",
    ],
    correctAnswer: 0,
    subjectId: "", // Will be filled from subjectMap
    tags: ["javascript", "variables", "scope"],
    isActive: true,
    createdBy: "system",
  },
  {
    title: "Explain closures in JavaScript",
    description:
      "Understanding JavaScript closures and their practical applications",
    category: "JavaScript Fundamentals",
    difficulty: "Medium",
    question:
      "What is a closure in JavaScript and provide a practical example?",
    answer:
      "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function returns. Example: function outer(x) { return function inner(y) { return x + y; }; } const add5 = outer(5); console.log(add5(3)); // 8",
    explanation:
      "Closures allow functions to access variables from their lexical scope even after the outer function has returned.",
    options: [
      "A function that can access variables from its outer scope",
      "A way to create private variables in JavaScript",
      "A method to optimize function performance",
      "A type of JavaScript data structure",
    ],
    correctAnswer: 0,
    subjectId: "", // Will be filled from subjectMap
    tags: ["javascript", "closures", "functions"],
    isActive: true,
    createdBy: "system",
  },
  {
    title: "React component lifecycle methods",
    description: "Understanding React component lifecycle and hooks",
    categoryId: "670c0274b35e3300154c775a",
    difficulty: "Medium",
    question:
      "Explain the React component lifecycle methods and their modern equivalents with hooks",
    answer:
      "Class components: componentDidMount, componentDidUpdate, componentWillUnmount. Hooks equivalent: useEffect with dependency array. useEffect(() => {}, []) for mount, useEffect(() => {}, [dependency]) for updates, useEffect(() => { return () => {} }, []) for cleanup.",
    explanation:
      "Understanding lifecycle methods helps manage component behavior and side effects.",
    options: [
      "componentDidMount, componentDidUpdate, componentWillUnmount",
      "useEffect with different dependency arrays",
      "Both A and B are correct",
      "Neither A nor B are correct",
    ],
    correctAnswer: 2,
    subjectId: "", // Will be   from subjectMap
    tags: ["react", "lifecycle", "hooks"],
    isActive: true,
    createdBy: "system",
  },
];

const funContentData = [
  {
    title: "JavaScript Quiz Challenge",
    description: "Test your JavaScript knowledge with this fun quiz",
    type: "quiz",
    category: "Quiz Games",
    difficulty: "Easy",
    content: "Answer questions about JavaScript fundamentals",
    tags: ["javascript", "quiz"],
    isActive: true,
    createdBy: "system",
  },
  {
    title: "React Puzzle Game",
    description: "Solve puzzles while learning React concepts",
    type: "puzzle",
    category: "Puzzles",
    difficulty: "Medium",
    content: "Interactive puzzle game with React components",
    tags: ["react", "puzzle", "game"],
    isActive: true,
    createdBy: "system",
  },
  {
    title: "Programming Meme Collection",
    description: "Fun programming memes to lighten your learning",
    type: "meme",
    category: "Memes & Jokes",
    difficulty: "Easy",
    content: "Collection of programming-related memes and jokes",
    tags: ["memes", "programming", "fun"],
    isActive: true,
    createdBy: "system",
  },
];

const syllabusData = [
  {
    title: "JavaScript Fundamentals - Complete Guide",
    description: "Complete syllabus for JavaScript fundamentals course",
    difficulty: "Beginner",
    subjectId: "", // Will be filled from subjectMap
    lessons: [
      {
        title: "Introduction to JavaScript",
        description: "Learn the basics of JavaScript programming",
        duration: 30,
        order: 1,
      },
      {
        title: "Variables and Data Types",
        description: "Understanding JavaScript variables and data types",
        duration: 45,
        order: 2,
      },
      {
        title: "Functions and Scope",
        description: "Deep dive into JavaScript functions and scope",
        duration: 60,
        order: 3,
      },
    ],
    isActive: true,
    createdBy: "system",
  },
];

async function seedContent() {
  try {
    console.log("🌱 Starting content data seeding...");

    await connectDB();

    // Get existing data
    const { subjectMap } = await getExistingData();
    console.log(
      "📋 Retrieved subject mapping:",
      Object.fromEntries(subjectMap)
    );

    // Clear existing content data
    console.log("🧹 Clearing existing content data...");
    await InterviewQuestion.deleteMany({});
    await FunContent.deleteMany({});
    await Syllabus.deleteMany({});

    // Create interview questions with subject IDs
    console.log("❓ Creating interview questions...");
    const questionsWithSubjectIds = interviewQuestionsData.map((question) => {
      const subjectId = subjectMap.get(question.category) || "";
      return { ...question, subjectId };
    });
    const createdQuestions = await InterviewQuestion.insertMany(
      questionsWithSubjectIds
    );
    console.log(`✅ Created ${createdQuestions.length} interview questions`);

    // Create fun content
    console.log("🎮 Creating fun content...");
    const createdFunContent = await FunContent.insertMany(funContentData);
    console.log(`✅ Created ${createdFunContent.length} fun content items`);

    // Create syllabus with subject IDs
    console.log("📖 Creating syllabus...");
    const syllabusWithSubjectIds = syllabusData.map((syllabus) => {
      const subjectId = subjectMap.get("JavaScript Fundamentals") || "";
      return { ...syllabus, subjectId };
    });
    const createdSyllabus = await Syllabus.insertMany(syllabusWithSubjectIds);
    console.log(`✅ Created ${createdSyllabus.length} syllabus entries`);

    console.log("🎉 Content data seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding content data:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database connection closed");
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedContent();
}

export default seedContent;
