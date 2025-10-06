# MindSpark Backend API

A comprehensive Node.js + TypeScript backend API for an educational platform with Firebase Authentication, MongoDB, and Cloudflare R2 file storage.

## 🚀 Features

- **Authentication**: Firebase Authentication with Google login support
- **Database**: MongoDB with Mongoose ODM
- **File Storage**: Cloudflare R2 for scalable file uploads
- **Architecture**: MVC pattern with class-based controllers
- **Security**: Rate limiting, CORS, helmet, input validation
- **TypeScript**: Full TypeScript support with strict type checking

## 📋 Requirements

- Node.js 18+
- MongoDB 4.4+
- Firebase Project with Admin SDK (service account JSON file provided)
- Cloudflare R2 Account

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd MindSpark-Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Fill in your environment variables in `.env`:

   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/mindspark

   # Firebase Configuration
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY_ID=your-private-key-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=your-client-id
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com
   FIREBASE_UNIVERSE_DOMAIN=googleapis.com

   # Cloudflare R2 Configuration
   R2_ACCESS_KEY_ID=your-r2-access-key
   R2_SECRET_ACCESS_KEY=your-r2-secret-key
   R2_BUCKET_NAME=your-bucket-name
   R2_ACCOUNT_ID=your-cloudflare-account-id
   R2_PUBLIC_URL=https://your-domain.com

   # Security
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # CORS
   CORS_ORIGIN=http://localhost:3000,http://localhost:3001
   ```

   **Note**: Firebase credentials are now configured using environment variables instead of JSON files for better security.

4. **Seed the database with sample data**

   ```bash
   npm run seed
   ```

   This will populate your database with:

   - 8 subjects (JavaScript, React, Data Structures, etc.)
   - 25+ interview questions across all categories
   - Sample fun content (quizzes, puzzles, memes)
   - Syllabus entries with modules and lessons
   - Sample users (students and admin)

5. **Run the application**

   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

## 📁 Project Structure

```
src/
├── config/           # Configuration files
│   ├── db.ts        # MongoDB connection
│   ├── firebase.ts  # Firebase Admin SDK
│   └── cloudflare.ts # Cloudflare R2 config
├── controllers/      # MVC Controllers
│   ├── SubjectController.ts
│   ├── SyllabusController.ts
│   ├── QuestionController.ts
│   ├── FunContentController.ts
│   ├── UploadController.ts
│   └── UserController.ts
├── middleware/       # Express middleware
│   ├── auth.ts      # Authentication
│   ├── role.ts      # Role-based access
│   └── validation.ts # Input validation
├── models/          # Mongoose models
│   ├── User.ts
│   ├── Subject.ts
│   ├── Syllabus.ts
│   ├── InterviewQuestion.ts
│   └── FunContent.ts
├── routes/          # API routes
│   ├── subjects.ts
│   ├── syllabus.ts
│   ├── questions.ts
│   ├── fun.ts
│   ├── upload.ts
│   └── users.ts
├── services/        # Business logic
│   ├── UserService.ts
│   ├── SubjectService.ts
│   ├── SyllabusService.ts
│   ├── QuestionService.ts
│   ├── FunContentService.ts
│   └── StorageService.ts
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── app.ts           # Express app configuration
└── server.ts        # Server entry point
```

## 🔐 Authentication

The API uses Firebase Authentication. Include the Firebase ID token in the Authorization header:

```bash
Authorization: Bearer <firebase-id-token>
```

## 📚 API Endpoints

### Subjects

- `GET /api/v1/subjects` - Get all subjects
- `POST /api/v1/subjects` - Create subject (Admin only)
- `GET /api/v1/subjects/:id` - Get subject by ID
- `PUT /api/v1/subjects/:id` - Update subject (Admin only)
- `DELETE /api/v1/subjects/:id` - Delete subject (Admin only)

### Syllabus

- `GET /api/v1/syllabus/:subjectId` - Get syllabus for subject
- `POST /api/v1/syllabus/:subjectId` - Create syllabus (Admin only)
- `PUT /api/v1/syllabus/:id` - Update syllabus (Admin only)
- `DELETE /api/v1/syllabus/:id` - Delete syllabus (Admin only)

### Interview Questions

- `GET /api/v1/questions/:subjectId` - Get questions for subject
- `POST /api/v1/questions/:subjectId` - Create question (Admin only)
- `GET /api/v1/questions/:subjectId/random` - Get random questions
- `PUT /api/v1/questions/:id` - Update question (Admin only)
- `DELETE /api/v1/questions/:id` - Delete question (Admin only)

### Fun Content

- `GET /api/v1/fun` - Get fun content
- `POST /api/v1/fun` - Create fun content (Admin only)
- `GET /api/v1/fun/type/:type` - Get content by type
- `GET /api/v1/fun/:subjectId` - Get fun content for subject
- `PUT /api/v1/fun/:id` - Update fun content (Admin only)
- `DELETE /api/v1/fun/:id` - Delete fun content (Admin only)

### File Upload

- `POST /api/v1/upload/single` - Upload single file
- `POST /api/v1/upload/multiple` - Upload multiple files
- `POST /api/v1/upload/lesson` - Upload lesson files
- `POST /api/v1/upload/fun` - Upload fun content files
- `DELETE /api/v1/upload` - Delete file

### Users

- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users/stats` - Get user statistics
- `PUT /api/v1/users/preferences` - Update user preferences

## 🗄️ Database Models

### User

```typescript
{
  uid: string;           // Firebase UID
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
  preferences?: object;
  stats?: object;
}
```

### Subject

```typescript
{
  title: string;
  description: string;
  icon?: string;
  color?: string;
  difficulty: string;
  estimatedTime?: string;
  createdBy: string;
}
```

### Syllabus

```typescript
{
  subjectId: string;
  title: string;
  description?: string;
  modules: Array<{
    title: string;
    lessons: Array<{
      title: string;
      content: string;
      fileUrl?: string;
      duration?: string;
      difficulty?: string;
      order: number;
      type?: string;
    }>;
    order: number;
  }>;
  difficulty: string;
  createdBy: string;
}
```

### InterviewQuestion

```typescript
{
  subjectId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: string;
  explanation: string;
  category?: string;
  createdBy: string;
}
```

### FunContent

```typescript
{
  type: 'quiz' | 'puzzle' | 'meme' | 'motivational';
  title: string;
  content: string;
  fileUrl?: string;
  subjectId?: string;
  difficulty?: string;
  createdBy: string;
}
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: Express-validator for request validation
- **Authentication**: Firebase token verification
- **Role-based Access**: Admin and student roles

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Production
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint errors

# Testing
npm test            # Run tests
```

## 🚀 Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Set environment variables** in your production environment

3. **Start the server**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@mindspark.com or create an issue in the repository.

## 🔄 API Response Format

All API responses follow this format:

```typescript
{
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## 📊 Health Check

Check API health at: `GET /api/v1/health`

Response:

```json
{
  "success": true,
  "message": "MindSpark Backend API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```
