import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import {
  FeaturedContent,
  FeaturedQuestion,
  TopRatedSubject,
  Achievement,
} from "../models/index.js";
import { Subject, InterviewQuestion } from "../models/index.js";

// Load environment variables
dotenv.config();

async function getExistingData() {
  // Get existing data from database
  const subjects = await Subject.find({});
  const interviewQuestions = await InterviewQuestion.find({});

  const subjectMap = new Map();
  subjects.forEach((subject) => {
    subjectMap.set(subject.title, subject._id.toString());
  });

  const questionMap = new Map();
  interviewQuestions.forEach((question) => {
    questionMap.set(
      (question as any).question,
      (question._id as any).toString()
    );
  });

  return { subjectMap, questionMap };
}

const featuredContentData = [
  {
    title: "JavaScript Fundamentals Crash Course",
    description: "Master the basics of JavaScript in 2 hours",
    type: "course",
    duration: "2h",
    rating: 4.8,
    students: 1250,
    color: "#3B82F6",
    icon: "logo-javascript",
    isActive: true,
    createdBy: "system",
  },
  {
    title: "React Hooks Deep Dive",
    description: "Learn advanced React patterns and hooks",
    type: "tutorial",
    duration: "1.5h",
    rating: 4.9,
    students: 890,
    color: "#61DAFB",
    icon: "logo-react",
    isActive: true,
    createdBy: "system",
  },
  {
    title: "Algorithm Problem Solving",
    description: "Solve coding challenges step by step",
    type: "challenge",
    duration: "3h",
    rating: 4.7,
    students: 2100,
    color: "#10B981",
    icon: "code-slash",
    isActive: true,
    createdBy: "system",
  },
  {
    title: "System Design Patterns",
    description: "Build scalable applications with proven patterns",
    type: "course",
    duration: "4h",
    rating: 4.6,
    students: 750,
    color: "#8B5CF6",
    icon: "git-network",
    isActive: true,
    createdBy: "system",
  },
  {
    title: "Node.js Backend Mastery",
    description: "Build robust server-side applications",
    type: "course",
    duration: "5h",
    rating: 4.5,
    students: 680,
    color: "#10B981",
    icon: "server",
    isActive: true,
    createdBy: "system",
  },
];

const featuredQuestionsData = [
  {
    title:
      "What are the key differences between let, const, and var in JavaScript?",
    category: "JavaScript Fundamentals",
    difficulty: "Easy",
    views: 15420,
    answered: false,
    isActive: true,
    createdBy: "system",
  },
  {
    title: "What is a closure in JavaScript and provide a practical example?",
    category: "JavaScript Fundamentals",
    difficulty: "Medium",
    views: 8930,
    answered: false,
    isActive: true,
    createdBy: "system",
  },
  {
    title:
      "Explain the React component lifecycle methods and their modern equivalents with hooks",
    category: "React & React Native",
    difficulty: "Medium",
    views: 12750,
    answered: false,
    isActive: true,
    createdBy: "system",
  },
];

const topRatedSubjectsData = [
  {
    title: "JavaScript Fundamentals",
    rating: 4.9,
    students: 3450,
    progress: 75,
    color: "#3B82F6",
    icon: "logo-javascript",
    isActive: true,
    createdBy: "system",
  },
  {
    title: "React & React Native",
    rating: 4.8,
    students: 2890,
    progress: 60,
    color: "#61DAFB",
    icon: "logo-react",
    isActive: true,
    createdBy: "system",
  },
  {
    title: "Data Structures & Algorithms",
    rating: 4.7,
    students: 4120,
    progress: 45,
    color: "#10B981",
    icon: "code-slash",
    isActive: true,
    createdBy: "system",
  },
  {
    title: "Node.js & Backend",
    rating: 4.6,
    students: 1980,
    progress: 80,
    color: "#10B981",
    icon: "server",
    isActive: true,
    createdBy: "system",
  },
];

const achievementsData = [
  {
    title: "First Steps",
    description: "Completed your first lesson",
    icon: "trophy",
    color: "#F59E0B",
    date: new Date("2024-01-15T10:30:00.000Z"),
    type: "lesson",
    points: 10,
    isActive: true,
    createdBy: "system",
  },
  {
    title: "JavaScript Master",
    description: "Completed JavaScript Fundamentals course",
    icon: "medal",
    color: "#3B82F6",
    date: new Date("2024-01-14T16:45:00.000Z"),
    type: "course",
    points: 50,
    isActive: true,
    createdBy: "system",
  },
  {
    title: "Problem Solver",
    description: "Solved 50 coding challenges",
    icon: "star",
    color: "#10B981",
    date: new Date("2024-01-13T14:20:00.000Z"),
    type: "challenge",
    points: 75,
    isActive: true,
    createdBy: "system",
  },
  {
    title: "Streak Master",
    description: "7-day learning streak",
    icon: "flame",
    color: "#EF4444",
    date: new Date("2024-01-12T09:15:00.000Z"),
    type: "streak",
    points: 25,
    isActive: true,
    createdBy: "system",
  },
  {
    title: "Quiz Champion",
    description: "Achieved 90% accuracy in quizzes",
    icon: "checkmark-circle",
    color: "#06B6D4",
    date: new Date("2024-01-11T11:30:00.000Z"),
    type: "milestone",
    points: 40,
    isActive: true,
    createdBy: "system",
  },
];

async function seedDashboard() {
  try {
    console.log("🌱 Starting dashboard data seeding...");

    await connectDB();

    // Get existing data
    const { subjectMap, questionMap } = await getExistingData();
    console.log("📋 Retrieved mappings:", {
      subjects: Object.fromEntries(subjectMap),
      questions: Object.fromEntries(questionMap),
    });

    // Clear existing dashboard data
    console.log("🧹 Clearing existing dashboard data...");
    await FeaturedContent.deleteMany({});
    await FeaturedQuestion.deleteMany({});
    await TopRatedSubject.deleteMany({});
    await Achievement.deleteMany({});

    // Create featured content
    console.log("📊 Creating featured content...");
    const createdFeaturedContent = await FeaturedContent.insertMany(
      featuredContentData
    );
    console.log(
      `✅ Created ${createdFeaturedContent.length} featured content items`
    );

    // Create featured questions with questionId links
    console.log("📊 Creating featured questions...");
    const featuredQuestionsWithIds = featuredQuestionsData.map((fq) => {
      // Link to existing interview questions by matching titles
      const questionId = questionMap.get(fq.title) || "";
      return { ...fq, questionId };
    });
    const createdFeaturedQuestions = await FeaturedQuestion.insertMany(
      featuredQuestionsWithIds
    );
    console.log(
      `✅ Created ${createdFeaturedQuestions.length} featured questions`
    );

    // Create top rated subjects
    console.log("📊 Creating top rated subjects...");
    const createdTopRatedSubjects = await TopRatedSubject.insertMany(
      topRatedSubjectsData
    );
    console.log(
      `✅ Created ${createdTopRatedSubjects.length} top rated subjects`
    );

    // Create achievements
    console.log("📊 Creating achievements...");
    const createdAchievements = await Achievement.insertMany(achievementsData);
    console.log(`✅ Created ${createdAchievements.length} achievements`);

    console.log("🎉 Dashboard data seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding dashboard data:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database connection closed");
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDashboard();
}

export default seedDashboard;
