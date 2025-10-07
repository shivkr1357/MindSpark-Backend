# Category System Documentation

## Overview

The Category system provides a flexible and hierarchical way to organize content in the MindSpark learning platform. Categories can be used to group Subjects, Lessons, Questions, Coding Questions, Quiz Questions, and Puzzles.

## Features

- **Hierarchical Structure**: Support for parent-child relationships (subcategories)
- **Flexible Organization**: Link categories to multiple content types
- **SEO-Friendly**: Auto-generated slugs for URL-friendly navigation
- **Customizable**: Icons, colors, and ordering support
- **Active/Inactive States**: Control category visibility

## Category Model

### Fields

| Field              | Type    | Required       | Description                            |
| ------------------ | ------- | -------------- | -------------------------------------- |
| `name`             | String  | Yes            | Category name (max 100 chars)          |
| `slug`             | String  | Auto-generated | URL-friendly identifier                |
| `description`      | String  | Yes            | Category description (max 500 chars)   |
| `icon`             | String  | No             | Emoji or icon identifier (default: 📂) |
| `color`            | String  | No             | Hex color code (default: #3B82F6)      |
| `order`            | Number  | No             | Display order (default: 0)             |
| `isActive`         | Boolean | No             | Visibility status (default: true)      |
| `parentCategoryId` | String  | No             | Reference to parent category           |
| `createdBy`        | String  | Yes            | User ID who created the category       |

### Relationships

Categories are linked to the following models:

- **Subject**: `categoryId` field
- **Lesson**: `categoryId` field
- **QuizQuestion**: `categoryId` field
- **CodingQuestion**: `categoryId` field
- **Puzzle**: `categoryId` field

## API Endpoints

### Public Endpoints (Authenticated)

#### Get All Categories

```
GET /api/categories?page=1&limit=50
```

#### Get Active Categories

```
GET /api/categories/active?page=1&limit=50
```

#### Get Top-Level Categories

```
GET /api/categories/top-level?page=1&limit=50
```

#### Get Category by ID

```
GET /api/categories/:id
```

#### Get Category by Slug

```
GET /api/categories/slug/:slug
```

#### Get Subcategories

```
GET /api/categories/:id/subcategories?page=1&limit=50
```

#### Search Categories

```
GET /api/categories/search?q=programming&page=1&limit=50
```

### Admin Endpoints

#### Create Category

```
POST /api/categories
```

**Request Body:**

```json
{
  "name": "Web Development",
  "slug": "web-development", // Optional, auto-generated if not provided
  "description": "Learn web development technologies",
  "icon": "🌐",
  "color": "#3B82F6",
  "order": 1,
  "isActive": true,
  "parentCategoryId": null // or parent category ID
}
```

#### Update Category

```
PUT /api/categories/:id
```

**Request Body:**

```json
{
  "name": "Advanced Web Development",
  "description": "Advanced web development concepts",
  "order": 2
}
```

#### Delete Category

```
DELETE /api/categories/:id
```

#### Get Category Statistics

```
GET /api/categories/admin/stats
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalCategories": 25,
    "activeCategories": 20,
    "topLevelCategories": 5
  }
}
```

#### Reorder Categories

```
POST /api/categories/admin/reorder
```

**Request Body:**

```json
{
  "categoryIds": ["cat1_id", "cat2_id", "cat3_id"]
}
```

## Usage Examples

### Creating a Category Hierarchy

1. **Create Parent Category:**

```javascript
POST /api/categories
{
  "name": "Programming",
  "description": "Programming languages and concepts",
  "icon": "💻",
  "color": "#10B981"
}
```

2. **Create Subcategories:**

```javascript
POST /api/categories
{
  "name": "Web Development",
  "description": "Frontend and backend web technologies",
  "icon": "🌐",
  "parentCategoryId": "programming_category_id"
}

POST /api/categories
{
  "name": "Mobile Development",
  "description": "iOS and Android development",
  "icon": "📱",
  "parentCategoryId": "programming_category_id"
}
```

### Linking Categories to Content

#### Create a Subject with Category

```javascript
POST /api/subjects
{
  "title": "React.js Fundamentals",
  "description": "Learn React from scratch",
  "categoryId": "web_development_category_id",
  "difficulty": "Intermediate"
}
```

#### Create a Lesson with Category

```javascript
POST /api/lessons
{
  "title": "Introduction to Hooks",
  "description": "Learn React Hooks",
  "categoryId": "web_development_category_id",
  "subjectId": "react_subject_id",
  "difficulty": "Intermediate"
}
```

## Frontend Integration

### Using the Categories Service

```typescript
import categoriesService from "./services/categoriesService";

// Get all categories
const { data: categories } = await categoriesService.getCategories(1, 50);

// Get top-level categories for navigation
const { data: mainCategories } =
  await categoriesService.getTopLevelCategories();

// Get subcategories
const { data: subcategories } = await categoriesService.getSubcategories(
  parentId
);

// Create a new category
const newCategory = await categoriesService.createCategory({
  name: "Data Science",
  description: "Data science and machine learning",
  icon: "📊",
  color: "#8B5CF6",
});

// Search categories
const { data: searchResults } = await categoriesService.searchCategories("web");
```

## Best Practices

1. **Naming Conventions:**

   - Use clear, descriptive names
   - Keep names concise (under 50 characters recommended)
   - Use title case for category names

2. **Slug Generation:**

   - Slugs are auto-generated from names
   - Manual slugs should be lowercase with hyphens
   - Example: "Web Development" → "web-development"

3. **Hierarchy:**

   - Limit nesting to 2-3 levels for better UX
   - Top-level categories should be broad topics
   - Subcategories should be specific specializations

4. **Colors and Icons:**

   - Use consistent color schemes across related categories
   - Choose emojis that visually represent the category
   - Ensure sufficient contrast for accessibility

5. **Ordering:**
   - Order categories logically (e.g., beginner to advanced)
   - Use increments of 10 (10, 20, 30) for easy reordering
   - Group related categories with similar order values

## Database Indexes

The Category model includes the following indexes for optimal performance:

- `name`: For name-based queries
- `slug`: For URL-based lookups
- `isActive`: For filtering active categories
- `order`: For sorted queries
- `parentCategoryId`: For hierarchical queries
- `createdBy`: For user-based filtering
- Compound: `(isActive, order)`, `(parentCategoryId, order)`

## Migration Guide

If you have existing data with string-based categories, you'll need to:

1. **Create category records** for all unique category strings
2. **Update existing records** to reference category IDs instead of strings
3. **Verify relationships** are correctly established

Example migration script pattern:

```javascript
// 1. Extract unique categories
const uniqueCategories = [...new Set(lessons.map((l) => l.category))];

// 2. Create category documents
const categoryMap = {};
for (const categoryName of uniqueCategories) {
  const category = await Category.create({
    name: categoryName,
    description: `Category for ${categoryName}`,
    createdBy: adminUserId,
  });
  categoryMap[categoryName] = category._id;
}

// 3. Update lesson documents
for (const lesson of lessons) {
  await Lesson.findByIdAndUpdate(lesson._id, {
    categoryId: categoryMap[lesson.category],
  });
}
```

## Validation Rules

- **Name**: Required, 1-100 characters
- **Slug**: Optional, auto-generated, lowercase alphanumeric with hyphens
- **Description**: Required, 1-500 characters
- **Color**: Optional, must be valid hex code (#RRGGBB)
- **Order**: Optional, non-negative integer
- **isActive**: Optional, boolean
- **parentCategoryId**: Optional, must be valid category ID or null

## Error Handling

Common errors and solutions:

| Error                       | Cause                   | Solution                                  |
| --------------------------- | ----------------------- | ----------------------------------------- |
| "Category not found"        | Invalid category ID     | Verify the category ID exists             |
| "Duplicate slug"            | Slug already exists     | Use a unique slug or let it auto-generate |
| "Invalid color code"        | Color not in hex format | Use format #RRGGBB (e.g., #3B82F6)        |
| "Parent category not found" | Invalid parent ID       | Verify parent category exists             |

## Future Enhancements

Potential features for future development:

- Category aliases/synonyms for search
- Category metadata for SEO
- Category templates for quick setup
- Category analytics (content count, popularity)
- Category permissions (visibility by role)
- Multi-language category names
- Category tags for cross-referencing
