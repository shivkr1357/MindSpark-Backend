# Database Seeding Scripts

This project now uses modular seeding scripts that handle dependencies properly by fetching existing data from the database before seeding dependent models.

## Scripts Overview

### 1. `seedCore.ts` - Core Data

**Dependencies**: None (base data)
**Data**: Subjects, Users, Progress Stats
**Usage**: `npm run seed:core`

### 2. `seedContent.ts` - Content Data

**Dependencies**: Subjects (from database)
**Data**: Interview Questions, Fun Content, Syllabus
**Usage**: `npm run seed:content`

### 3. `seedNested.ts` - Nested Data

**Dependencies**: Subjects, Interview Questions, Fun Content (from database)
**Data**: Quiz Questions, Puzzles, Memes, Motivations, Coding Questions, Lessons
**Usage**: `npm run seed:nested`

### 4. `seedDashboard.ts` - Dashboard Data

**Dependencies**: Subjects, Interview Questions (from database)
**Data**: Featured Content, Featured Questions, Top Rated Subjects, Achievements
**Usage**: `npm run seed:dashboard`

### 5. `seedAll.ts` - Complete Seeding

**Dependencies**: Runs all scripts in correct order
**Usage**: `npm run seed` or `npm run seed:all`

## Key Features

### ✅ Dependency Handling

- Each script fetches existing data from the database before seeding
- Uses `getExistingData()` functions to create ID mappings
- Prevents duplicate key errors and ensures proper relationships

### ✅ Modular Structure

- Each script can be run independently
- Easy to maintain and extend
- Clear separation of concerns

### ✅ Error Handling

- Proper error handling and logging
- Database connection management
- Graceful cleanup on errors

## Usage Examples

```bash
# Seed everything (recommended)
npm run seed

# Seed individual modules
npm run seed:core
npm run seed:content
npm run seed:nested
npm run seed:dashboard

# Alternative complete seeding
npm run seed:all
```

## Data Flow

```
1. seedCore.ts
   ├── Creates: Subjects, Users, Progress Stats
   └── Provides: Subject IDs, User IDs

2. seedContent.ts
   ├── Fetches: Subjects from DB
   ├── Creates: Interview Questions, Fun Content, Syllabus
   └── Provides: Question IDs, Content IDs

3. seedNested.ts
   ├── Fetches: Subjects, Questions, Fun Content from DB
   ├── Creates: Quiz Questions, Puzzles, Memes, etc.
   └── Links: All nested data to parent records

4. seedDashboard.ts
   ├── Fetches: Subjects, Questions from DB
   ├── Creates: Featured Content, Achievements, etc.
   └── Links: Dashboard data to existing records
```

## Benefits

- **No Duplicate Key Errors**: Proper dependency handling
- **Flexible Seeding**: Run individual modules as needed
- **Maintainable**: Clear structure and separation
- **Extensible**: Easy to add new seeding modules
- **Reliable**: Proper error handling and cleanup

## Migration from Old Script

The old `seedDatabase.ts` has been replaced with these modular scripts. The new approach:

- Handles dependencies by fetching from database
- Prevents duplicate key errors
- Provides better error handling
- Allows selective seeding of modules
