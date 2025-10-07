import mongoose, { Schema, Document } from "mongoose";

export interface IUserSubjectEnrollment extends Document {
  _id: string;
  userId: string;
  subjectId: string;
  enrolledAt: Date;
  progress: number; // 0-100
  lessonsCompleted: number;
  totalLessons: number;
  quizzesCompleted: number;
  totalQuizzes: number;
  lastAccessedAt: Date;
  completedAt?: Date;
  status: "enrolled" | "in-progress" | "completed" | "dropped";
  certificateIssued: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSubjectEnrollmentSchema = new Schema<IUserSubjectEnrollment>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    subjectId: {
      type: String,
      required: true,
      ref: "Subject",
    },
    enrolledAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    progress: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    lessonsCompleted: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    totalLessons: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    quizzesCompleted: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    totalQuizzes: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    lastAccessedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["enrolled", "in-progress", "completed", "dropped"],
      default: "enrolled",
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
userSubjectEnrollmentSchema.index({ userId: 1 });
userSubjectEnrollmentSchema.index({ subjectId: 1 });
userSubjectEnrollmentSchema.index({ status: 1 });
userSubjectEnrollmentSchema.index({ progress: -1 });
userSubjectEnrollmentSchema.index({ enrolledAt: -1 });
userSubjectEnrollmentSchema.index({ lastAccessedAt: -1 });
userSubjectEnrollmentSchema.index({ completedAt: -1 });
userSubjectEnrollmentSchema.index({ createdAt: -1 });

// Compound indexes
userSubjectEnrollmentSchema.index(
  { userId: 1, subjectId: 1 },
  { unique: true }
); // One enrollment per user per subject
userSubjectEnrollmentSchema.index({ userId: 1, status: 1 });
userSubjectEnrollmentSchema.index({ userId: 1, progress: -1 });
userSubjectEnrollmentSchema.index({ userId: 1, lastAccessedAt: -1 });

// Pre-save middleware to calculate progress and update status
userSubjectEnrollmentSchema.pre("save", function (next) {
  // Calculate progress
  if (this.totalLessons > 0) {
    this.progress = Math.round(
      (this.lessonsCompleted / this.totalLessons) * 100
    );
  }

  // Update status based on progress
  if (this.progress >= 100 && this.status !== "completed") {
    this.status = "completed";
    this.completedAt = new Date();
  } else if (this.progress > 0 && this.status === "enrolled") {
    this.status = "in-progress";
  }

  next();
});

// Ensure virtual fields are serialized
userSubjectEnrollmentSchema.set("toJSON", { virtuals: true });
userSubjectEnrollmentSchema.set("toObject", { virtuals: true });

export const UserSubjectEnrollment = mongoose.model<IUserSubjectEnrollment>(
  "UserSubjectEnrollment",
  userSubjectEnrollmentSchema
);
