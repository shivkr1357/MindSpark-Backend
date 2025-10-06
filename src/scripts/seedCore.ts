import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { Subject, User, ProgressStats } from "../models/index.js";

// Load environment variables
dotenv.config();

// Core data that other models depend on
const subjectsData = [
  {
    title: "JavaScript Fundamentals",
    description: "Core JavaScript concepts, ES6+ features, and modern syntax",
    icon: "logo-javascript",
    color: "#3B82F6",
    difficulty: "Beginner",
    estimatedTime: "12h",
    totalLessons: 15,
    completedLessons: 8,
    progress: 53,
    createdBy: "system",
    isActive: true,
  },
  {
    title: "React & React Native",
    description:
      "Component lifecycle, hooks, state management, and mobile development",
    icon: "logo-react",
    color: "#61DAFB",
    difficulty: "Intermediate",
    estimatedTime: "8h",
    totalLessons: 12,
    completedLessons: 5,
    progress: 42,
    createdBy: "system",
    isActive: true,
  },
  {
    title: "Data Structures & Algorithms",
    description:
      "Arrays, objects, sorting, searching, and problem-solving techniques",
    icon: "code-slash",
    color: "#10B981",
    difficulty: "Advanced",
    estimatedTime: "15h",
    totalLessons: 20,
    completedLessons: 3,
    progress: 15,
    createdBy: "system",
    isActive: true,
  },
  {
    title: "System Design",
    description: "Architecture patterns, scalability, and distributed systems",
    icon: "git-network",
    color: "#8B5CF6",
    difficulty: "Expert",
    estimatedTime: "20h",
    totalLessons: 25,
    completedLessons: 0,
    progress: 0,
    createdBy: "system",
    isActive: true,
  },
  {
    title: "Node.js & Backend",
    description: "Server-side JavaScript, APIs, databases, and deployment",
    icon: "server",
    color: "#10B981",
    difficulty: "Intermediate",
    estimatedTime: "10h",
    totalLessons: 14,
    completedLessons: 7,
    progress: 50,
    createdBy: "system",
    isActive: true,
  },
  {
    title: "Database & SQL",
    description: "Database design, queries, optimization, and NoSQL concepts",
    icon: "database",
    color: "#F59E0B",
    difficulty: "Intermediate",
    estimatedTime: "14h",
    totalLessons: 18,
    completedLessons: 12,
    progress: 67,
    createdBy: "system",
    isActive: true,
  },
  {
    title: "Web Security",
    description:
      "Authentication, authorization, HTTPS, and security best practices",
    icon: "shield-checkmark",
    color: "#EF4444",
    difficulty: "Advanced",
    estimatedTime: "8h",
    totalLessons: 10,
    completedLessons: 2,
    progress: 20,
    createdBy: "system",
    isActive: true,
  },
  {
    title: "Testing & Quality",
    description:
      "Unit testing, integration testing, and code quality practices",
    icon: "checkmark-circle",
    color: "#06B6D4",
    difficulty: "Intermediate",
    estimatedTime: "6h",
    totalLessons: 8,
    completedLessons: 6,
    progress: 75,
    createdBy: "system",
    isActive: true,
  },
];

const usersData = [
  {
    uid: "user1",
    email: "john.doe@example.com",
    name: "John Doe",
    role: "student",
    isActive: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    uid: "user2",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    role: "student",
    isActive: true,
    createdAt: new Date("2024-01-02"),
  },
  {
    uid: "admin1",
    email: "admin@mindspark.com",
    name: "Admin User",
    role: "admin",
    isActive: true,
    createdAt: new Date("2024-01-01"),
  },
];

const progressStatsData = [
  {
    userId: "default",
    lessonsCompleted: 24,
    questionsAnswered: 156,
    accuracy: 87,
    totalStudyTime: 1200,
    streak: 7,
    level: 3,
    experience: 450,
    createdBy: "system",
  },
];

async function seedCore() {
  try {
    console.log("🌱 Starting core data seeding...");

    await connectDB();

    // Clear existing core data
    console.log("🧹 Clearing existing core data...");
    await Subject.deleteMany({});
    await User.deleteMany({});
    await ProgressStats.deleteMany({});

    // Create subjects
    console.log("📚 Creating subjects...");
    const createdSubjects = await Subject.insertMany(subjectsData);
    console.log(`✅ Created ${createdSubjects.length} subjects`);

    // Create subject mapping for other scripts
    const subjectMap = new Map();
    createdSubjects.forEach((subject) => {
      subjectMap.set(subject.title, subject._id.toString());
    });
    console.log("📋 Subject mapping created:", Object.fromEntries(subjectMap));

    // Create users
    console.log("👥 Creating users...");
    const createdUsers = await User.insertMany(usersData);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create progress stats
    console.log("📊 Creating progress stats...");
    const createdProgressStats = await ProgressStats.insertMany(
      progressStatsData
    );
    console.log(`✅ Created ${createdProgressStats.length} progress stats`);

    console.log("🎉 Core data seeding completed successfully!");

    // Export data for other scripts
    return {
      subjects: createdSubjects,
      users: createdUsers,
      progressStats: createdProgressStats,
      subjectMap,
    };
  } catch (error) {
    console.error("❌ Error seeding core data:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database connection closed");
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCore();
}

export default seedCore;
