import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";

// Import individual seeding scripts
import seedCore from "./seedCore.js";
import seedContent from "./seedContent.js";
import seedNested from "./seedNested.js";
import seedDashboard from "./seedDashboard.js";

// Load environment variables
dotenv.config();

async function seedAll() {
  try {
    console.log("🌱 Starting complete database seeding...");

    await connectDB();

    console.log("\n=== STEP 1: Seeding Core Data ===");
    await seedCore();

    console.log("\n=== STEP 2: Seeding Content Data ===");
    await seedContent();

    console.log("\n=== STEP 3: Seeding Nested Data ===");
    await seedNested();

    console.log("\n=== STEP 4: Seeding Dashboard Data ===");
    await seedDashboard();

    console.log("\n🎉 Complete database seeding finished successfully!");
    console.log("\n📊 Summary:");
    console.log("- Core data: Subjects, Users, Progress Stats");
    console.log("- Content data: Interview Questions, Fun Content, Syllabus");
    console.log(
      "- Nested data: Quiz Questions, Puzzles, Memes, Motivations, Coding Questions, Lessons"
    );
    console.log(
      "- Dashboard data: Featured Content, Featured Questions, Top Rated Subjects, Achievements"
    );
  } catch (error) {
    console.error("❌ Error in complete seeding:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database connection closed");
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAll();
}

export default seedAll;
