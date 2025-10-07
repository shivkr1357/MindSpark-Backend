import mongoose, { Schema, Document } from "mongoose";
import { ICategory } from "../types/index.js";

export interface ICategoryDocument extends ICategory, Document {
  _id: string;
}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    icon: {
      type: String,
      default: "folder",
    },
    color: {
      type: String,
      default: "#3B82F6",
      validate: {
        validator: function (v: string) {
          return /^#[0-9A-F]{6}$/i.test(v);
        },
        message: "Color must be a valid hex color code",
      },
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    parentCategoryId: {
      type: String,
      ref: "Category",
      default: null,
    },
    createdBy: {
      type: String,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ order: 1 });
categorySchema.index({ parentCategoryId: 1 });
categorySchema.index({ createdBy: 1 });
categorySchema.index({ createdAt: -1 });

// Compound indexes
categorySchema.index({ isActive: 1, order: 1 });
categorySchema.index({ parentCategoryId: 1, order: 1 });

// Pre-save middleware to generate slug if not provided
categorySchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

// Virtual for subcategories count
categorySchema.virtual("subcategoriesCount", {
  ref: "Category",
  localField: "_id",
  foreignField: "parentCategoryId",
  count: true,
});

// Ensure virtual fields are serialized
categorySchema.set("toJSON", { virtuals: true });
categorySchema.set("toObject", { virtuals: true });

export const Category = mongoose.model<ICategoryDocument>(
  "Category",
  categorySchema
);
