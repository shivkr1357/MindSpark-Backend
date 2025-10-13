import mongoose from "mongoose";
import { InterviewQuestion } from "../models/index.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Script to mark some interview questions as featured
 * This will randomly select 10 questions and mark them as featured
 */
async function markFeaturedQuestions() {
  try {
    const mongoUser = process.env.MONGODB_USER;
    const mongoPassword = process.env.MONGODB_PASSWORD;
    const mongoDatabase = process.env.MONGODB_DATABASE || "mindspark";

    const mongoUri =
      process.env.MONGODB_URI ||
      `mongodb+srv://${mongoUser}:${mongoPassword}@cluster0.ru9s9.mongodb.net/${mongoDatabase}?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(mongoUri);

    // Get all interview questions (don't filter by isActive initially)
    let allQuestions = await InterviewQuestion.find({});

    if (allQuestions.length === 0) {
      console.log("No interview questions found. Please seed questions first.");
      return;
    }

    // First, update all questions to have isActive: true if not set
    await InterviewQuestion.updateMany(
      { isActive: { $ne: false } },
      { $set: { isActive: true, featured: false } }
    );

    // Re-fetch to get updated questions
    allQuestions = await InterviewQuestion.find({ isActive: true });

    // Select random questions to mark as featured (at least 10, or all if less than 10)
    const numberOfFeatured = Math.min(10, allQuestions.length);

    // Shuffle and take first N questions
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, numberOfFeatured);

    // Mark selected questions as featured
    const updatePromises = selectedQuestions.map((question) =>
      InterviewQuestion.findByIdAndUpdate(question._id, { featured: true })
    );

    await Promise.all(updatePromises);

    console.log(
      `✅ Successfully marked ${numberOfFeatured} questions as featured`
    );

    const featuredCount = await InterviewQuestion.countDocuments({
      featured: true,
    });
    console.log(`📊 Total featured questions: ${featuredCount}`);
  } catch (error) {
    console.error("Error marking featured questions:", error);
    throw error;
  } finally {
    await mongoose.connection.close();
  }
}

// Run the script
markFeaturedQuestions()
  .then(() => {
    console.log("\n✨ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
